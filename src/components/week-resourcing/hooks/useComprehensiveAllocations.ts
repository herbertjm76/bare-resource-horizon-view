
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { useDemoAuth } from '@/hooks/useDemoAuth';
import { generateDemoAllocations } from '@/data/demoData';

interface UseComprehensiveAllocationsOptions {
  weekStartDate: string;
  memberIds: string[];
  enabled?: boolean;
}

export const useComprehensiveAllocations = ({ 
  weekStartDate, 
  memberIds,
  enabled = true 
}: UseComprehensiveAllocationsOptions) => {
  const { company } = useCompany();
  const { isDemoMode } = useDemoAuth();

  const { data: comprehensiveWeeklyAllocations, isLoading, error } = useQuery({
    queryKey: ['comprehensive-weekly-allocations', isDemoMode ? 'demo' : company?.id, weekStartDate, memberIds],
    queryFn: async () => {
      // Demo mode: filter demo allocations
      if (isDemoMode) {
        const allAllocations = generateDemoAllocations();
        return allAllocations.filter(
          alloc => alloc.allocation_date === weekStartDate && memberIds.includes(alloc.resource_id)
        );
      }

      if (!company?.id || memberIds.length === 0) {
        return [];
      }
      
      // RULEBOOK: Weekly overview shows BOTH active (profiles) AND pre_registered (invites) members.
      // We must fetch allocations for BOTH resource types to ensure consistency with Resource Scheduling.
      // Each member's allocations are correctly typed - no double-counting because member IDs are unique.
      const { data, error } = await supabase
        .from('project_resource_allocations')
        .select('*')
        .eq('company_id', company.id)
        .eq('allocation_date', weekStartDate)
        .in('resource_type', ['active', 'pre_registered'])
        .in('resource_id', memberIds);

      if (error) {
        throw error;
      }

      return data || [];
    },
    enabled: (isDemoMode || !!company?.id) && memberIds.length > 0 && enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    comprehensiveWeeklyAllocations,
    isLoading,
    error
  };
};
