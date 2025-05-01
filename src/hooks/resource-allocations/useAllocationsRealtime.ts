
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ResourceAllocation } from './types';
import { formatDateKey } from './utils';

export const useAllocationsRealtime = (
  projectId: string, 
  resourceId: string, 
  resourceType: 'active' | 'pre_registered',
  companyId?: string,
  setAllocations?: React.Dispatch<React.SetStateAction<Record<string, number>>>,
  fetchAllocations?: () => Promise<void>
) => {
  // Setup realtime subscription for this resource's allocations
  useEffect(() => {
    if (!projectId || !resourceId || !companyId || !setAllocations || !fetchAllocations) return;
    
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
  }, [projectId, resourceId, resourceType, companyId, setAllocations, fetchAllocations]);
};
