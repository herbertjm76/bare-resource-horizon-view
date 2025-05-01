
import { useState, useEffect, useCallback } from 'react';
import { format, parseISO } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { toast } from 'sonner';

export interface ResourceAllocation {
  id?: string;
  project_id: string;
  resource_id: string;
  resource_type: 'active' | 'pre_registered';
  week_start_date: string;
  hours: number;
  company_id?: string;
}

export function useResourceAllocationsDB(projectId: string, resourceId: string, resourceType: 'active' | 'pre_registered') {
  const [allocations, setAllocations] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { company } = useCompany();
  
  // Format date to yyyy-MM-dd for database consistency
  const formatDateKey = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), 'yyyy-MM-dd');
    } catch (e) {
      console.error('Error formatting date:', dateStr, e);
      return dateStr;
    }
  };

  // Fetch initial allocations for this resource and project
  const fetchAllocations = useCallback(async () => {
    if (!projectId || !resourceId || !company?.id) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('project_resource_allocations')
        .select('id, week_start_date, hours')
        .eq('project_id', projectId)
        .eq('resource_id', resourceId)
        .eq('resource_type', resourceType)
        .eq('company_id', company.id);
      
      if (error) throw error;
      
      // Transform data into a week key -> hours mapping
      const allocationMap: Record<string, number> = {};
      data?.forEach(item => {
        const weekKey = formatDateKey(item.week_start_date);
        allocationMap[weekKey] = item.hours;
      });
      
      setAllocations(allocationMap);
    } catch (error) {
      console.error('Error fetching resource allocations:', error);
      toast.error('Failed to fetch resource allocations');
    } finally {
      setIsLoading(false);
    }
  }, [projectId, resourceId, resourceType, company?.id]);

  // Save or update allocation for a specific week
  const saveAllocation = useCallback(async (weekKey: string, hours: number) => {
    if (!projectId || !resourceId || !company?.id) return;
    
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
        .eq('company_id', company.id)
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
            company_id: company.id
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
  }, [projectId, resourceId, resourceType, company?.id]);

  // Delete allocation for a specific week
  const deleteAllocation = useCallback(async (weekKey: string) => {
    if (!projectId || !resourceId || !company?.id) return;
    
    const formattedWeekKey = formatDateKey(weekKey);
    
    try {
      const { error } = await supabase
        .from('project_resource_allocations')
        .delete()
        .eq('project_id', projectId)
        .eq('resource_id', resourceId)
        .eq('resource_type', resourceType)
        .eq('week_start_date', formattedWeekKey)
        .eq('company_id', company.id);
      
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
  }, [projectId, resourceId, resourceType, company?.id]);

  // Setup realtime subscription for this resource's allocations
  useEffect(() => {
    if (!projectId || !resourceId || !company?.id) return;
    
    // Fetch initial data
    fetchAllocations();
    
    // Setup realtime subscription
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
          
          setAllocations(prev => ({
            ...prev,
            [weekKey]: newData.hours
          }));
        } 
        else if (payload.eventType === 'DELETE') {
          const oldData = payload.old as ResourceAllocation;
          const weekKey = formatDateKey(oldData.week_start_date);
          
          setAllocations(prev => {
            const updated = { ...prev };
            delete updated[weekKey];
            return updated;
          });
        }
      })
      .subscribe();
    
    // Cleanup subscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId, resourceId, resourceType, company?.id, fetchAllocations]);

  return {
    allocations,
    isLoading,
    isSaving,
    saveAllocation,
    deleteAllocation,
    refreshAllocations: fetchAllocations
  };
}
