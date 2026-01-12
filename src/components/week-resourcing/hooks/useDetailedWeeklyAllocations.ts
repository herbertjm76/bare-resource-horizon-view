
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { format, addDays } from 'date-fns';
import { useAppSettings } from '@/hooks/useAppSettings';
import { getWeekStartDate } from '@/utils/weekNormalization';
import { useDemoAuth } from '@/hooks/useDemoAuth';
import { generateDemoAllocations, DEMO_PROJECTS, DEMO_COMPANY_ID } from '@/data/demoData';

interface DailyAllocation {
  allocation_id: string;
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
    allocation_id: string;
    daily_breakdown: Array<{
      date: string;
      hours: number;
    }>;
  }>;
}

export const useDetailedWeeklyAllocations = (selectedWeek: Date, memberIds: string[], weekStartDay?: 'Monday' | 'Sunday' | 'Saturday') => {
  const { company } = useCompany();
  const { startOfWorkWeek } = useAppSettings();
  const { isDemoMode } = useDemoAuth();
  const effectiveWeekStart = weekStartDay || startOfWorkWeek;

  return useQuery({
    queryKey: ['detailed-weekly-allocations', selectedWeek, isDemoMode ? DEMO_COMPANY_ID : company?.id, memberIds, effectiveWeekStart],
    queryFn: async (): Promise<Record<string, DetailedMemberAllocation>> => {
      const companyId = isDemoMode ? DEMO_COMPANY_ID : company?.id;
      if (!companyId || memberIds.length === 0) return {};

      const weekStart = getWeekStartDate(selectedWeek, effectiveWeekStart);
      const weekEnd = addDays(weekStart, 6);
      const weekStartDate = format(weekStart, 'yyyy-MM-dd');
      const weekEndDate = format(weekEnd, 'yyyy-MM-dd');

      // Demo mode: Use demo allocations
      if (isDemoMode) {
        const demoAllocations = generateDemoAllocations();
        
        // Filter to this week and these members
        const filteredAllocations = demoAllocations.filter(alloc => 
          memberIds.includes(alloc.resource_id) &&
          alloc.allocation_date >= weekStartDate &&
          alloc.allocation_date <= weekEndDate &&
          alloc.hours > 0
        );

        // Group by member and build detailed structure
        const result: Record<string, DetailedMemberAllocation> = {};

        filteredAllocations.forEach(allocation => {
          const memberId = allocation.resource_id;
          const projectId = allocation.project_id;
          const allocationId = allocation.id;
          const date = allocation.allocation_date;
          const hours = Number(allocation.hours) || 0;
          
          // Find project details
          const project = DEMO_PROJECTS.find(p => p.id === projectId);
          const projectName = project?.name || 'Unknown Project';
          const projectCode = project?.code || 'UNK';

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
            allocation_id: allocationId,
            project_id: projectId,
            project_name: projectName,
            project_code: projectCode,
            date: date,
            hours: hours
          });

          result[memberId].total_hours += hours;

          // Find or create project entry
          let projectEntry = result[memberId].projects.find(p => p.project_id === projectId);
          if (!projectEntry) {
            projectEntry = {
              project_id: projectId,
              project_name: projectName,
              project_code: projectCode,
              total_hours: 0,
              allocation_id: allocationId,
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
      }

      // Real mode: Fetch from Supabase
      // RULEBOOK: Weekly overview shows BOTH active (profiles) AND pre_registered (invites) members.
      // We must fetch allocations for BOTH resource types to ensure consistency with Resource Scheduling.
      // Each member's allocations are correctly typed - active members have active allocations,
      // pre_registered members have pre_registered allocations. No double-counting occurs
      // because each member ID is unique to either profiles OR invites.
      const { data: allocations, error } = await supabase
        .from('project_resource_allocations')
        .select(`
          id,
          resource_id,
          project_id,
          hours,
          allocation_date,
          resource_type,
          projects!inner(
            id,
            name,
            code
          )
        `)
        .eq('company_id', companyId)
        .in('resource_id', memberIds)
        .in('resource_type', ['active', 'pre_registered'])
        .gte('allocation_date', weekStartDate)
        .lte('allocation_date', weekEndDate)
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
        const allocationId = allocation.id;
        const date = allocation.allocation_date;
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

        result[memberId].daily_allocations.push({
          allocation_id: allocationId,
          project_id: projectId,
          project_name: project.name,
          project_code: project.code || project.name,
          date: date,
          hours: hours
        });

        result[memberId].total_hours += hours;

        let projectEntry = result[memberId].projects.find(p => p.project_id === projectId);
        if (!projectEntry) {
          projectEntry = {
            project_id: projectId,
            project_name: project.name,
            project_code: project.code || project.name,
            total_hours: 0,
            allocation_id: allocationId,
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
    enabled: (isDemoMode || !!company?.id) && memberIds.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes - keep data fresh longer
    gcTime: 5 * 60 * 1000,    // 5 minutes cache
    placeholderData: (previousData) => previousData, // Show previous data while loading new
  });
};
