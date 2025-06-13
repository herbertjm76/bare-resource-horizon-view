
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

      // Fetch ALL daily allocations for the entire week range
      const { data, error } = await supabase
        .from('resource_allocations')
        .select('resource_id, project_id, hours, date')
        .eq('company_id', company.id)
        .in('resource_id', memberIds)
        .gte('date', weekStartDate)
        .lte('date', weekEndDate);

      if (error) {
        console.error('Error fetching comprehensive weekly allocations:', error);
        return [];
      }

      console.log('Raw daily allocations fetched:', data?.length || 0);
      console.log('Sample daily allocations:', data?.slice(0, 5));
      
      // Group by member and project, then sum hours for the entire week
      const weeklyAllocations = new Map<string, { resource_id: string; project_id: string; hours: number; resource_type: string }>();
      
      data?.forEach(allocation => {
        const key = `${allocation.resource_id}:${allocation.project_id}`;
        const hours = Number(allocation.hours) || 0;
        
        if (weeklyAllocations.has(key)) {
          const existing = weeklyAllocations.get(key)!;
          existing.hours += hours;
        } else {
          // Determine resource type based on whether the member is in active or pre-registered list
          const resourceType = 'active'; // We'll improve this logic later if needed
          
          weeklyAllocations.set(key, {
            resource_id: allocation.resource_id,
            project_id: allocation.project_id,
            hours: hours,
            resource_type: resourceType
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
