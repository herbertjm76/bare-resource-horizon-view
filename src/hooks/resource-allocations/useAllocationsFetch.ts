
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { formatDateKey } from './utils';

export const useAllocationsFetch = (
  projectId: string, 
  resourceId: string, 
  resourceType: 'active' | 'pre_registered',
  companyId?: string
) => {
  const [allocations, setAllocations] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchAllocations = useCallback(async () => {
    if (!projectId || !resourceId || !companyId) return;
    
    setIsLoading(true);
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
      
      setAllocations(allocationMap);
    } catch (error) {
      console.error('Error fetching resource allocations:', error);
      toast.error('Failed to fetch resource allocations');
    } finally {
      setIsLoading(false);
    }
  }, [projectId, resourceId, resourceType, companyId]);
  
  return {
    allocations,
    setAllocations,
    isLoading,
    fetchAllocations
  };
};
