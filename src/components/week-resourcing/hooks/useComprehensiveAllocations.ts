
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { startOfWeek, endOfWeek, format, addDays } from 'date-fns';

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

      console.log('=== FETCHING COMPREHENSIVE WEEKLY ALLOCATIONS (FIXED V2) ===');
      console.log('Week starting:', weekStartDate);
      console.log('All member IDs (active + pre-registered):', memberIds);

      // Calculate the week start and end dates (Monday to Sunday)
      const weekStart = new Date(weekStartDate);
      const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
      const weekEndDate = format(weekEnd, 'yyyy-MM-dd');

      console.log('Fetching allocations between:', weekStartDate, 'and', weekEndDate);

      // Generate all dates for the week (Monday through Sunday)
      const weekDates = [];
      for (let i = 0; i < 7; i++) {
        const date = addDays(weekStart, i);
        weekDates.push(format(date, 'yyyy-MM-dd'));
      }

      console.log('Week dates to fetch:', weekDates);

      // Fetch ALL allocations for ANY day within the week range
      const { data, error } = await supabase
        .from('project_resource_allocations')
        .select('resource_id, project_id, hours, week_start_date, resource_type')
        .eq('company_id', company.id)
        .in('resource_id', memberIds)
        .in('week_start_date', weekDates); // Fetch for all days in the week

      if (error) {
        console.error('Error fetching comprehensive weekly allocations:', error);
        return [];
      }

      console.log('Raw allocations fetched for all days in week:', data?.length || 0);
      console.log('Sample allocations:', data?.slice(0, 10));
      
      // Group by member and project, then sum hours for the ENTIRE week
      const weeklyAllocations = new Map<string, { resource_id: string; project_id: string; hours: number; resource_type: string }>();
      
      data?.forEach(allocation => {
        const key = `${allocation.resource_id}:${allocation.project_id}`;
        const hours = Number(allocation.hours) || 0;
        
        if (weeklyAllocations.has(key)) {
          const existing = weeklyAllocations.get(key)!;
          existing.hours += hours; // Sum up all hours for this member-project combination across the week
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
      
      console.log('Aggregated weekly allocations (summed across all days):', aggregatedAllocations.length);
      console.log('Weekly allocations by member:', aggregatedAllocations.reduce((acc, allocation) => {
        const memberId = allocation.resource_id;
        if (!acc[memberId]) acc[memberId] = { totalHours: 0, projects: [] };
        acc[memberId].totalHours += allocation.hours;
        acc[memberId].projects.push({
          project_id: allocation.project_id,
          hours: allocation.hours
        });
        return acc;
      }, {} as Record<string, any>));

      return aggregatedAllocations;
    },
    enabled: !!company?.id && memberIds.length > 0
  });

  return { comprehensiveWeeklyAllocations };
};
