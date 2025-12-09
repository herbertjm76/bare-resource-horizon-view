
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';

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

  const { data: comprehensiveWeeklyAllocations, isLoading, error } = useQuery({
    queryKey: ['comprehensive-weekly-allocations', company?.id, weekStartDate, memberIds],
    queryFn: async () => {
      if (!company?.id || memberIds.length === 0) {
        return [];
      }
      
      const { data, error } = await supabase
        .from('project_resource_allocations')
        .select('*')
        .eq('company_id', company.id)
        .eq('allocation_date', weekStartDate)
        .in('resource_id', memberIds);

      if (error) {
        throw error;
      }

      return data || [];
    },
    enabled: !!company?.id && memberIds.length > 0 && enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    comprehensiveWeeklyAllocations,
    isLoading,
    error
  };
};
