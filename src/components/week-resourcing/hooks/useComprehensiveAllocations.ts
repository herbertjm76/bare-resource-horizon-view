
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

      console.log('🔍 COMPREHENSIVE ALLOCATIONS: Fetching for week:', weekStartDate, 'members:', memberIds.length);
      console.log('🔍 COMPREHENSIVE ALLOCATIONS: Query parameters:', { 
        company_id: company.id, 
        week_start_date: weekStartDate, 
        resource_ids: memberIds 
      });
      
      const { data, error } = await supabase
        .from('project_resource_allocations')
        .select('*')
        .eq('company_id', company.id)
        .eq('week_start_date', weekStartDate)
        .in('resource_id', memberIds);

      if (error) {
        console.error('🔍 COMPREHENSIVE ALLOCATIONS: Error fetching allocations:', error);
        throw error;
      }

      console.log('🔍 COMPREHENSIVE ALLOCATIONS: Successfully fetched', data?.length || 0, 'allocation records');
      console.log('🔍 COMPREHENSIVE ALLOCATIONS: Sample data:', data?.slice(0, 3));
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
