
import { useState, useEffect, useCallback } from 'react';
import { useCompany } from '@/context/CompanyContext';
import { supabase } from '@/integrations/supabase/client';
import { ResourceAllocation, UseResourceAllocationsReturn } from './types';
import { formatDateKey } from './utils';
import { 
  fetchResourceAllocations, 
  saveResourceAllocation, 
  deleteResourceAllocation 
} from './api';
import { logger } from '@/utils/logger';

export function useResourceAllocationsDB(
  projectId: string, 
  resourceId: string, 
  resourceType: 'active' | 'pre_registered'
): UseResourceAllocationsReturn {
  const [allocations, setAllocations] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { company } = useCompany();

  // Fetch initial allocations for this resource and project
  const refreshAllocations = useCallback(async () => {
    if (!projectId || !resourceId || !company?.id) return;
    
    setIsLoading(true);
    try {
      const allocationMap = await fetchResourceAllocations(
        projectId,
        resourceId,
        resourceType,
        company.id
        // Note: No date range for backward compatibility - fetches all allocations
      );
      
      logger.log('Fetched allocations:', allocationMap);
      setAllocations(allocationMap);
    } finally {
      setIsLoading(false);
    }
  }, [projectId, resourceId, resourceType, company?.id]);

  // Save or update allocation for a specific week
  const saveAllocation = useCallback(async (weekKey: string, hours: number) => {
    if (!projectId || !resourceId || !company?.id) return;
    
    setIsSaving(true);
    try {
      logger.log(`Saving allocation: week=${weekKey}, hours=${hours}`);
      const success = await saveResourceAllocation(
        projectId,
        resourceId,
        resourceType,
        weekKey,
        hours,
        company.id
      );
      
      if (success) {
        // Update local state (optimistic update)
        setAllocations(prev => ({
          ...prev,
          [formatDateKey(weekKey)]: hours
        }));
      }
    } finally {
      setIsSaving(false);
    }
  }, [projectId, resourceId, resourceType, company?.id]);

  // Delete allocation for a specific week
  const deleteAllocation = useCallback(async (weekKey: string) => {
    if (!projectId || !resourceId || !company?.id) return;
    
    try {
      const success = await deleteResourceAllocation(
        projectId,
        resourceId,
        resourceType,
        weekKey,
        company.id
      );
      
      if (success) {
        // Update local state
        setAllocations(prev => {
          const updated = { ...prev };
          delete updated[formatDateKey(weekKey)];
          return updated;
        });
      }
    } catch (error) {
      logger.error('Error deleting allocation:', error);
    }
  }, [projectId, resourceId, resourceType, company?.id]);

  // Setup realtime subscription for this resource's allocations
  useEffect(() => {
    if (!projectId || !resourceId || !company?.id) return;
    
    // Fetch initial data
    refreshAllocations();
    
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
          const weekKey = formatDateKey(newData.allocation_date);
          
          logger.log('Realtime update received:', newData);
          setAllocations(prev => ({
            ...prev,
            [weekKey]: newData.hours
          }));
        } 
        else if (payload.eventType === 'DELETE') {
          const oldData = payload.old as ResourceAllocation;
          const weekKey = formatDateKey(oldData.allocation_date);
          
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
  }, [projectId, resourceId, resourceType, company?.id, refreshAllocations]);

  return {
    allocations,
    isLoading,
    isSaving,
    saveAllocation,
    deleteAllocation,
    refreshAllocations
  };
}
