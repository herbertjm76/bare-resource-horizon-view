import { supabase } from '@/integrations/supabase/client';
import { formatDateKey } from './utils';
import { toast } from 'sonner';
import { normalizeToWeekStart, assertIsWeekStart } from '@/utils/weekNormalization';
import type { WeekStartDay } from '@/hooks/useAppSettings';
import { logger } from '@/utils/logger';

export const fetchResourceAllocations = async (
  projectId: string,
  resourceId: string, 
  resourceType: 'active' | 'pre_registered',
  companyId: string,
  weekStartDay: WeekStartDay,
  dateRange?: { startDate: string; endDate: string }
): Promise<Record<string, number>> => {
  try {
    logger.debug(`🔍 ALLOCATION API: Fetching allocations for resource ${resourceId} in project ${projectId}`);
    
    let query = supabase
      .from('project_resource_allocations')
      .select('id, allocation_date, hours')
      .eq('project_id', projectId)
      .eq('resource_id', resourceId)
      .eq('resource_type', resourceType)
      .eq('company_id', companyId);
    
    // Apply date range filter if provided
    if (dateRange) {
      logger.debug(`🔍 ALLOCATION API: Applying date range filter: ${dateRange.startDate} to ${dateRange.endDate}`);
      query = query
        .gte('allocation_date', dateRange.startDate)
        .lte('allocation_date', dateRange.endDate);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    logger.debug(`🔍 ALLOCATION API: Retrieved ${data?.length || 0} allocation records`);
    
    // Transform data into a week key -> hours mapping, aggregating daily hours into weekly totals
    // IMPORTANT: Normalize all allocation dates to company week start for consistent lookups
    const allocationMap: Record<string, number> = {};
    data?.forEach(item => {
      // Normalize to company's week start day
      const weekKey = normalizeToWeekStart(item.allocation_date, weekStartDay);
      
      // Aggregate hours by normalized week
      allocationMap[weekKey] = (allocationMap[weekKey] || 0) + item.hours;
      logger.debug(`🔍 ALLOCATION API: Aggregating ${item.allocation_date} -> ${weekKey} (normalized to ${weekStartDay}): +${item.hours}h (total: ${allocationMap[weekKey]}h)`);
    });
    
    return allocationMap;
  } catch (error) {
    console.error('Error fetching resource allocations:', error);
    toast.error('Failed to fetch resource allocations');
    return {};
  }
};

export const saveResourceAllocation = async (
  projectId: string,
  resourceId: string,
  resourceType: 'active' | 'pre_registered',
  weekKey: string,
  hours: number,
  companyId: string,
  weekStartDay: WeekStartDay
): Promise<boolean> => {
  try {
    // Always normalize the weekKey to company's week start
    const normalizedWeekKey = normalizeToWeekStart(weekKey, weekStartDay);
    assertIsWeekStart(normalizedWeekKey, weekStartDay, 'saveResourceAllocation');
    
    logger.debug(`Saving allocation for week starting: ${normalizedWeekKey} (${weekStartDay})`);
    
    // Check if we already have an allocation for this week
    const { data: existingData } = await supabase
      .from('project_resource_allocations')
      .select('id')
      .eq('project_id', projectId)
      .eq('resource_id', resourceId)
      .eq('resource_type', resourceType)
      .eq('allocation_date', normalizedWeekKey)
      .eq('company_id', companyId)
      .maybeSingle();
    
    let result;
    
    if (existingData) {
      // Update existing allocation
      result = await supabase
        .from('project_resource_allocations')
        .update({ hours })
        .eq('id', existingData.id)
        .select();
    } else {
      // Insert new allocation (DB trigger will also normalize the date as safety net)
      result = await supabase
        .from('project_resource_allocations')
        .insert({
          project_id: projectId,
          resource_id: resourceId,
          resource_type: resourceType,
          allocation_date: normalizedWeekKey,
          hours,
          company_id: companyId
        })
        .select();
    }
    
    if (result.error) throw result.error;
    return true;
  } catch (error) {
    console.error('Error saving allocation:', error);
    toast.error('Failed to save allocation');
    return false;
  }
};

export const deleteResourceAllocation = async (
  projectId: string,
  resourceId: string,
  resourceType: 'active' | 'pre_registered',
  weekKey: string,
  companyId: string,
  weekStartDay: WeekStartDay
): Promise<boolean> => {
  try {
    // Always normalize the weekKey to company's week start
    const normalizedWeekKey = normalizeToWeekStart(weekKey, weekStartDay);
    
    const { error } = await supabase
      .from('project_resource_allocations')
      .delete()
      .eq('project_id', projectId)
      .eq('resource_id', resourceId)
      .eq('resource_type', resourceType)
      .eq('allocation_date', normalizedWeekKey)
      .eq('company_id', companyId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting allocation:', error);
    toast.error('Failed to delete allocation');
    return false;
  }
};
