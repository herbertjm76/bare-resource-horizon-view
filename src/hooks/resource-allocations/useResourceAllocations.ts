
import { useState, useEffect, useCallback } from 'react';
import { useCompany } from '@/context/CompanyContext';
import { ResourceAllocationsMap, ResourceAllocationsState } from './types';
import { 
  fetchResourceAllocations, 
  saveResourceAllocation, 
  deleteResourceAllocation,
  setupRealtimeSubscription 
} from './resourceAllocationsService';
import { supabase } from '@/integrations/supabase/client';

export function useResourceAllocations(
  projectId: string, 
  resourceId: string, 
  resourceType: 'active' | 'pre_registered'
): ResourceAllocationsState {
  const [allocations, setAllocations] = useState<ResourceAllocationsMap>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { company } = useCompany();
  
  // Fetch initial allocations for this resource and project
  const refreshAllocations = useCallback(async () => {
    if (!projectId || !resourceId || !company?.id) return;
    
    setIsLoading(true);
    const data = await fetchResourceAllocations(projectId, resourceId, resourceType, company?.id);
    setAllocations(data);
    setIsLoading(false);
  }, [projectId, resourceId, resourceType, company?.id]);

  // Save or update allocation for a specific week
  const saveAllocation = useCallback(async (weekKey: string, hours: number) => {
    if (!projectId || !resourceId || !company?.id) return;
    
    setIsSaving(true);
    const success = await saveResourceAllocation(
      projectId, resourceId, resourceType, weekKey, hours, company?.id
    );
    
    if (success) {
      // Optimistic update
      setAllocations(prev => ({
        ...prev,
        [weekKey]: hours
      }));
    }
    
    setIsSaving(false);
  }, [projectId, resourceId, resourceType, company?.id]);

  // Delete allocation for a specific week
  const deleteAllocation = useCallback(async (weekKey: string) => {
    if (!projectId || !resourceId || !company?.id) return;
    
    const success = await deleteResourceAllocation(
      projectId, resourceId, resourceType, weekKey, company?.id
    );
    
    if (success) {
      setAllocations(prev => {
        const updated = { ...prev };
        delete updated[weekKey];
        return updated;
      });
    }
  }, [projectId, resourceId, resourceType, company?.id]);

  // Handler for realtime allocation changes
  const handleAllocationChange = useCallback((weekKey: string, hours: number | null) => {
    setAllocations(prev => {
      const updated = { ...prev };
      if (hours === null) {
        delete updated[weekKey];
      } else {
        updated[weekKey] = hours;
      }
      return updated;
    });
  }, []);

  // Setup realtime subscription for this resource's allocations
  useEffect(() => {
    if (!projectId || !resourceId || !company?.id) return;
    
    // Fetch initial data
    refreshAllocations();
    
    // Setup realtime subscription
    const channel = setupRealtimeSubscription(
      projectId, 
      resourceId, 
      resourceType, 
      handleAllocationChange
    );
    
    // Cleanup subscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId, resourceId, resourceType, company?.id, refreshAllocations, handleAllocationChange]);

  return {
    allocations,
    isLoading,
    isSaving,
    saveAllocation,
    deleteAllocation,
    refreshAllocations
  };
}
