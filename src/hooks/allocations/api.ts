
import { supabase } from '@/integrations/supabase/client';
import { ResourceAllocation } from './types';
import { formatDateKey } from './utils';
import { toast } from 'sonner';

export const fetchResourceAllocations = async (
  projectId: string,
  resourceId: string, 
  resourceType: 'active' | 'pre_registered',
  companyId: string
): Promise<Record<string, number>> => {
  try {
    const { data, error } = await supabase
      .from('project_resource_allocations')
      .select('id, week_start_date, hours')
      .eq('project_id', projectId)
      .eq('resource_id', resourceId)
      .eq('resource_type', resourceType)
      .eq('company_id', companyId);
    
    if (error) throw error;
    
    // Transform data into a week key -> hours mapping
    const allocationMap: Record<string, number> = {};
    data?.forEach(item => {
      const weekKey = formatDateKey(item.week_start_date);
      allocationMap[weekKey] = item.hours;
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
    const formattedWeekKey = formatDateKey(weekKey);
    
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
    const formattedWeekKey = formatDateKey(weekKey);
    
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
