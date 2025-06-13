
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { startOfWeek, endOfWeek, format } from 'date-fns';

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

      console.log('=== FETCHING COMPREHENSIVE WEEKLY ALLOCATIONS (FIXED) ===');
      console.log('Week starting:', weekStartDate);
      console.log('All member IDs (active + pre-registered):', memberIds);

      // Calculate the week end date
      const weekStart = new Date(weekStartDate);
      const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
      const weekEndDate = format(weekEnd, 'yyyy-MM-dd');

      console.log('Fetching allocations between:', weekStartDate, 'and', weekEndDate);

      // Fetch ALL weekly allocations for the entire week range from project_resource_allocations
      const { data, error } = await supabase
        .from('project_resource_allocations')
        .select('resource_id, project_id, hours, week_start_date, resource_type')
        .eq('company_id', company.id)
        .in('resource_id', memberIds)
        .eq('week_start_date', weekStartDate); // Match exact week

      if (error) {
        console.error('Error fetching comprehensive weekly allocations:', error);
        return [];
      }

      console.log('Raw weekly allocations fetched:', data?.length || 0);
      console.log('Sample weekly allocations:', data?.slice(0, 5));
      
      // Group by member and project, then sum hours for the entire week
      const weeklyAllocations = new Map<string, { resource_id: string; project_id: string; hours: number; resource_type: string }>();
      
      data?.forEach(allocation => {
        const key = `${allocation.resource_id}:${allocation.project_id}`;
        const hours = Number(allocation.hours) || 0;
        
        if (weeklyAllocations.has(key)) {
          const existing = weeklyAllocations.get(key)!;
          existing.hours += hours;
        } else {
          weeklyAllocations.set(key, {
            resource_id: allocation.resource_id,
            project_id: allocation.project_id,
            hours: hours,
            resource_type: allocation.resource_type || 'active'
          });
        }
      });

      const aggregatedAllocations = Array.from(weeklyAllocations.values()).filter(allocation => allocation.hours > 0);
      
      console.log('Aggregated weekly allocations:', aggregatedAllocations.length);
      console.log('Weekly allocations by member:', aggregatedAllocations.reduce((acc, allocation) => {
        const memberId = allocation.resource_id;
        if (!acc[memberId]) acc[memberId] = [];
        acc[memberId].push({
          project_id: allocation.project_id,
          hours: allocation.hours
        });
        return acc;
      }, {} as Record<string, any[]>));

      return aggregatedAllocations;
    },
    enabled: !!company?.id && memberIds.length > 0
  });

  return { comprehensiveWeeklyAllocations };
};
