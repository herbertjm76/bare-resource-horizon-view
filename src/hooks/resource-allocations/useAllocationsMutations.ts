
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { formatDateKey } from './utils';

export const useAllocationsMutations = (
  projectId: string, 
  resourceId: string, 
  resourceType: 'active' | 'pre_registered',
  companyId?: string,
  setAllocations?: (updater: (prev: Record<string, number>) => Record<string, number>) => void
) => {
  const [isSaving, setIsSaving] = useState(false);
  
  // Save or update allocation for a specific week
  const saveAllocation = useCallback(async (weekKey: string, hours: number) => {
    if (!projectId || !resourceId || !companyId || !setAllocations) return;
    
    const formattedWeekKey = formatDateKey(weekKey);
    
    setIsSaving(true);
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
      
      // Update local state (optimistic update)
      setAllocations(prev => ({
        ...prev,
        [formattedWeekKey]: hours
      }));
      
    } catch (error) {
      console.error('Error saving allocation:', error);
      toast.error('Failed to save allocation');
    } finally {
      setIsSaving(false);
    }
  }, [projectId, resourceId, resourceType, companyId, setAllocations]);

  // Delete allocation for a specific week
  const deleteAllocation = useCallback(async (weekKey: string) => {
    if (!projectId || !resourceId || !companyId || !setAllocations) return;
    
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
      
      // Update local state
      setAllocations(prev => {
        const updated = { ...prev };
        delete updated[formattedWeekKey];
        return updated;
      });
      
    } catch (error) {
      console.error('Error deleting allocation:', error);
      toast.error('Failed to delete allocation');
    }
  }, [projectId, resourceId, resourceType, companyId, setAllocations]);
  
  return {
    isSaving,
    saveAllocation,
    deleteAllocation
  };
};
