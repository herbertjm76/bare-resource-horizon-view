
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
        console.log('Skipping comprehensive allocations fetch - no company or members');
        return [];
      }

      console.log('Fetching comprehensive allocations for week:', weekStartDate, 'members:', memberIds.length);
      
      const { data, error } = await supabase
        .from('project_resource_allocations')
        .select('*')
        .eq('company_id', company.id)
        .eq('week_start_date', weekStartDate)
        .in('resource_id', memberIds);

      if (error) {
        console.error('Error fetching comprehensive allocations:', error);
        throw error;
      }

      console.log('Successfully fetched comprehensive allocations:', data?.length || 0);
      return data || [];
    },
    enabled: !!company?.id && memberIds.length > 0 && enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    comprehensiveWeeklyAllocations,
    isLoading,
    error
  };
};
