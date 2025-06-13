
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';

interface UseComprehensiveAllocationsProps {
  weekStartDate: string;
  memberIds: string[];
}

export const useComprehensiveAllocations = ({ weekStartDate, memberIds }: UseComprehensiveAllocationsProps) => {
  const { company } = useCompany();

  const { data: comprehensiveWeeklyAllocations } = useQuery({
    queryKey: ['comprehensive-weekly-allocations', weekStartDate, company?.id, memberIds],
    queryFn: async () => {
      if (!company?.id || memberIds.length === 0) return [];

      console.log('=== FETCHING COMPREHENSIVE WEEKLY ALLOCATIONS ===');
      console.log('Week starting:', weekStartDate);
      console.log('All member IDs (active + pre-registered):', memberIds);

      // Fetch allocations for both active and pre-registered members
      const { data, error } = await supabase
        .from('project_resource_allocations')
        .select('resource_id, project_id, hours, week_start_date, resource_type')
        .eq('company_id', company.id)
        .in('resource_id', memberIds)
        .eq('week_start_date', weekStartDate)
        .in('resource_type', ['active', 'pre_registered']);

      if (error) {
        console.error('Error fetching comprehensive weekly allocations:', error);
        return [];
      }

      console.log('Raw comprehensive weekly allocations fetched:', data?.length || 0);
      console.log('All allocation data:', data);
      
      // Filter for allocations with hours > 0
      const activeAllocations = data?.filter(allocation => 
        Number(allocation.hours) > 0
      ) || [];
      
      console.log('Filtered allocations with hours > 0:', activeAllocations.length);
      console.log('Allocations by member and type:', activeAllocations.reduce((acc, allocation) => {
        const memberId = allocation.resource_id;
        const key = `${memberId} (${allocation.resource_type})`;
        if (!acc[key]) acc[key] = [];
        acc[key].push({
          project_id: allocation.project_id,
          hours: allocation.hours
        });
        return acc;
      }, {} as Record<string, any[]>));

      return activeAllocations;
    },
    enabled: !!company?.id && memberIds.length > 0
  });

  return { comprehensiveWeeklyAllocations };
};
