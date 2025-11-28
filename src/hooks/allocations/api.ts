
import { supabase } from '@/integrations/supabase/client';
import { ResourceAllocation } from './types';
import { formatDateKey } from './utils';
import { toast } from 'sonner';
import { getWeekStartDate } from './utils/dateUtils';
import { format } from 'date-fns';

export const fetchResourceAllocations = async (
  projectId: string,
  resourceId: string, 
  resourceType: 'active' | 'pre_registered',
  companyId: string,
  dateRange?: { startDate: string; endDate: string }
): Promise<Record<string, number>> => {
  try {
    console.log(`🔍 ALLOCATION API: Fetching allocations for resource ${resourceId} in project ${projectId}`);
    
    let query = supabase
      .from('project_resource_allocations')
      .select('id, week_start_date, hours')
      .eq('project_id', projectId)
      .eq('resource_id', resourceId)
      .eq('resource_type', resourceType)
      .eq('company_id', companyId);
    
    // Apply date range filter if provided
    if (dateRange) {
      console.log(`🔍 ALLOCATION API: Applying date range filter: ${dateRange.startDate} to ${dateRange.endDate}`);
      query = query
        .gte('week_start_date', dateRange.startDate)
        .lte('week_start_date', dateRange.endDate);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    console.log(`🔍 ALLOCATION API: Retrieved ${data?.length || 0} allocation records`);
    
    // Transform data into a week key -> hours mapping, aggregating daily hours into weekly totals
    const allocationMap: Record<string, number> = {};
    data?.forEach(item => {
      const weekKey = formatDateKey(item.week_start_date);
      // Aggregate hours by week (sum up multiple allocations for the same week)
      allocationMap[weekKey] = (allocationMap[weekKey] || 0) + item.hours;
      console.log(`🔍 ALLOCATION API: Aggregating ${item.week_start_date} -> ${weekKey}: +${item.hours}h (total: ${allocationMap[weekKey]}h)`);
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
    
    // Double-check that the date is a Monday
    // If it's not already a formatted date string, parse it
    if (weekKey.includes('T') || weekKey.includes(' ')) {
      const date = new Date(weekKey);
      const mondayDate = getWeekStartDate(date);
      formattedWeekKey = format(mondayDate, 'yyyy-MM-dd');
    }
    
    console.log(`Saving allocation for week starting: ${formattedWeekKey} (Monday)`);
    
    // Check if we already have an allocation for this week
    const { data: existingData } = await supabase
      .from('project_resource_allocations')
      .select('id')
      .eq('project_id', projectId)
      .eq('resource_id', resourceId)
      .eq('resource_type', resourceType)
      .eq('week_start_date', formattedWeekKey)
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
          week_start_date: formattedWeekKey,
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
    // Ensure we're using Monday as the week start
    let formattedWeekKey = formatDateKey(weekKey);
    
    // Double-check that the date is a Monday
    if (weekKey.includes('T') || weekKey.includes(' ')) {
      const date = new Date(weekKey);
      const mondayDate = getWeekStartDate(date);
      formattedWeekKey = format(mondayDate, 'yyyy-MM-dd');
    }
    
    const { error } = await supabase
      .from('project_resource_allocations')
      .delete()
      .eq('project_id', projectId)
      .eq('resource_id', resourceId)
      .eq('resource_type', resourceType)
      .eq('week_start_date', formattedWeekKey)
      .eq('company_id', companyId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting allocation:', error);
    toast.error('Failed to delete allocation');
    return false;
  }
};
