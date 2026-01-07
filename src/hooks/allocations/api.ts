
import { supabase } from '@/integrations/supabase/client';
import { ResourceAllocation } from './types';
import { formatDateKey } from './utils';
import { toast } from 'sonner';
import { getWeekStartDate } from './utils/dateUtils';
import { toUTCDateKey } from '@/utils/dateKey';
import { logger } from '@/utils/logger';

export const fetchResourceAllocations = async (
  projectId: string,
  resourceId: string, 
  resourceType: 'active' | 'pre_registered',
  companyId: string,
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
    const allocationMap: Record<string, number> = {};
    data?.forEach(item => {
      const weekKey = formatDateKey(item.allocation_date);
      // Aggregate hours by week (sum up multiple allocations for the same week)
      allocationMap[weekKey] = (allocationMap[weekKey] || 0) + item.hours;
      logger.debug(`🔍 ALLOCATION API: Aggregating ${item.allocation_date} -> ${weekKey}: +${item.hours}h (total: ${allocationMap[weekKey]}h)`);
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
  companyId: string
): Promise<boolean> => {
  try {
    // Ensure we're using Monday as the week start
    let formattedWeekKey = formatDateKey(weekKey);
    
    // Double-check that the date is a Monday (use UTC for consistency)
    if (weekKey.includes('T') || weekKey.includes(' ')) {
      const date = new Date(weekKey);
      const mondayDate = getWeekStartDate(date);
      formattedWeekKey = toUTCDateKey(mondayDate);
    }
    
    logger.debug(`Saving allocation for week starting: ${formattedWeekKey} (Monday)`);
    
    // Check if we already have an allocation for this week
    const { data: existingData } = await supabase
      .from('project_resource_allocations')
      .select('id')
      .eq('project_id', projectId)
      .eq('resource_id', resourceId)
      .eq('resource_type', resourceType)
      .eq('allocation_date', formattedWeekKey)
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
      // Insert new allocation
      result = await supabase
        .from('project_resource_allocations')
        .insert({
          project_id: projectId,
          resource_id: resourceId,
          resource_type: resourceType,
          allocation_date: formattedWeekKey,
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
  companyId: string
): Promise<boolean> => {
  try {
    // Ensure we're using Monday as the week start (UTC for consistency)
    let formattedWeekKey = formatDateKey(weekKey);
    
    if (weekKey.includes('T') || weekKey.includes(' ')) {
      const date = new Date(weekKey);
      const mondayDate = getWeekStartDate(date);
      formattedWeekKey = toUTCDateKey(mondayDate);
    }
    
    const { error } = await supabase
      .from('project_resource_allocations')
      .delete()
      .eq('project_id', projectId)
      .eq('resource_id', resourceId)
      .eq('resource_type', resourceType)
      .eq('allocation_date', formattedWeekKey)
      .eq('company_id', companyId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting allocation:', error);
    toast.error('Failed to delete allocation');
    return false;
  }
};
