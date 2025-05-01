
import { supabase } from '@/integrations/supabase/client';
import { formatDateKey } from './utils';
import { ResourceAllocation, ResourceAllocationsMap } from './types';
import { toast } from 'sonner';

export const fetchResourceAllocations = async (
  projectId: string, 
  resourceId: string, 
  resourceType: 'active' | 'pre_registered',
  companyId?: string
): Promise<ResourceAllocationsMap> => {
  if (!projectId || !resourceId || !companyId) return {};
  
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
    const allocationMap: ResourceAllocationsMap = {};
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
  companyId?: string
): Promise<boolean> => {
  if (!projectId || !resourceId || !companyId) return false;
  
  const formattedWeekKey = formatDateKey(weekKey);
  
  try {
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
  companyId?: string
): Promise<boolean> => {
  if (!projectId || !resourceId || !companyId) return false;
  
  const formattedWeekKey = formatDateKey(weekKey);
  
  try {
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

export const setupRealtimeSubscription = (
  projectId: string,
  resourceId: string,
  resourceType: 'active' | 'pre_registered',
  onDataChange: (allocationKey: string, newHours: number | null) => void
) => {
  const channel = supabase
    .channel('project-resource-changes')
    .on('postgres_changes', { 
      event: '*', 
      schema: 'public', 
      table: 'project_resource_allocations',
      filter: `project_id=eq.${projectId} AND resource_id=eq.${resourceId} AND resource_type=eq.${resourceType}`
    }, (payload) => {
      // Handle different types of changes
      if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
        const newData = payload.new as ResourceAllocation;
        const weekKey = formatDateKey(newData.week_start_date);
        onDataChange(weekKey, newData.hours);
      } 
      else if (payload.eventType === 'DELETE') {
        const oldData = payload.old as ResourceAllocation;
        const weekKey = formatDateKey(oldData.week_start_date);
        onDataChange(weekKey, null);
      }
    })
    .subscribe();
  
  return channel;
};
