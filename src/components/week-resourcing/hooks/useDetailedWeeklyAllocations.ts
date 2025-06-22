
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { format, addDays, startOfWeek } from 'date-fns';

interface DailyAllocation {
  project_id: string;
  project_name: string;
  project_code: string;
  date: string;
  hours: number;
}

interface DetailedMemberAllocation {
  member_id: string;
  daily_allocations: DailyAllocation[];
  total_hours: number;
  projects: Array<{
    project_id: string;
    project_name: string;
    project_code: string;
    total_hours: number;
    daily_breakdown: Array<{
      date: string;
      hours: number;
    }>;
  }>;
}

export const useDetailedWeeklyAllocations = (selectedWeek: Date, memberIds: string[]) => {
  const { company } = useCompany();

  return useQuery({
    queryKey: ['detailed-weekly-allocations', selectedWeek, company?.id, memberIds],
    queryFn: async (): Promise<Record<string, DetailedMemberAllocation>> => {
      if (!company?.id || memberIds.length === 0) return {};

      const weekStart = startOfWeek(selectedWeek, { weekStartsOn: 1 });
      
      // Generate all dates for the week (Monday through Sunday)
      const weekDates = [];
      for (let i = 0; i < 7; i++) {
        const date = addDays(weekStart, i);
        weekDates.push(format(date, 'yyyy-MM-dd'));
      }

      // Fetch allocations with project details
      const { data: allocations, error } = await supabase
        .from('project_resource_allocations')
        .select(`
          resource_id,
          project_id,
          hours,
          week_start_date,
          projects!inner(
            id,
            name,
            code
          )
        `)
        .eq('company_id', company.id)
        .in('resource_id', memberIds)
        .in('week_start_date', weekDates)
        .gt('hours', 0);

      if (error) {
        console.error('Error fetching detailed allocations:', error);
        return {};
      }

      // Group by member and build detailed structure
      const result: Record<string, DetailedMemberAllocation> = {};

      allocations?.forEach(allocation => {
        const memberId = allocation.resource_id;
        const projectId = allocation.project_id;
        const date = allocation.week_start_date;
        const hours = Number(allocation.hours) || 0;
        const project = allocation.projects;

        if (!result[memberId]) {
          result[memberId] = {
            member_id: memberId,
            daily_allocations: [],
            total_hours: 0,
            projects: []
          };
        }

        // Add to daily allocations
        result[memberId].daily_allocations.push({
          project_id: projectId,
          project_name: project.name,
          project_code: project.code || project.name,
          date: date,
          hours: hours
        });

        result[memberId].total_hours += hours;

        // Find or create project entry
        let projectEntry = result[memberId].projects.find(p => p.project_id === projectId);
        if (!projectEntry) {
          projectEntry = {
            project_id: projectId,
            project_name: project.name,
            project_code: project.code || project.name,
            total_hours: 0,
            daily_breakdown: []
          };
          result[memberId].projects.push(projectEntry);
        }

        projectEntry.total_hours += hours;
        projectEntry.daily_breakdown.push({
          date: date,
          hours: hours
        });
      });

      return result;
    },
    enabled: !!company?.id && memberIds.length > 0
  });
};
