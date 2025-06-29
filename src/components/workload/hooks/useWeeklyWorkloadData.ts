
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { TeamMember } from '@/components/dashboard/types';
import { startOfWeek, format, addWeeks } from 'date-fns';
import { WeeklyWorkloadBreakdown, ProjectAllocation } from './types';

export const useWeeklyWorkloadData = (
  members: TeamMember[],
  startDate: Date,
  numberOfWeeks: number = 12
) => {
  const { company } = useCompany();

  const { data: weeklyWorkloadData = {}, isLoading, error } = useQuery({
    queryKey: ['weekly-workload-data', company?.id, members.map(m => m.id), format(startDate, 'yyyy-MM-dd'), numberOfWeeks],
    queryFn: async () => {
      if (!company?.id || members.length === 0) {
        console.log('Skipping workload data fetch - no company or members');
        return {};
      }

      const memberIds = members.map(m => m.id);
      const result: Record<string, Record<string, WeeklyWorkloadBreakdown>> = {};

      console.log('Fetching workload data for:', {
        companyId: company.id,
        memberIds: memberIds.length,
        startDate: format(startDate, 'yyyy-MM-dd'),
        numberOfWeeks
      });

      // Initialize all members and weeks with empty data
      for (const member of members) {
        result[member.id] = {};
        for (let i = 0; i < numberOfWeeks; i++) {
          const weekStart = startOfWeek(addWeeks(startDate, i), { weekStartsOn: 1 });
          const weekKey = format(weekStart, 'yyyy-MM-dd');
          result[member.id][weekKey] = {
            projectHours: 0,
            annualLeave: 0,
            officeHolidays: 0,
            otherLeave: 0,
            total: 0,
            projects: []
          };
        }
      }

      // Fetch project allocations for all weeks
      const weekStartDates = [];
      for (let i = 0; i < numberOfWeeks; i++) {
        const weekStart = startOfWeek(addWeeks(startDate, i), { weekStartsOn: 1 });
        weekStartDates.push(format(weekStart, 'yyyy-MM-dd'));
      }

      // Get project allocations with project details
      const { data: allocations, error: allocationsError } = await supabase
        .from('project_resource_allocations')
        .select(`
          resource_id,
          project_id,
          hours,
          week_start_date,
          projects:project_id (
            id,
            name,
            code
          )
        `)
        .eq('company_id', company.id)
        .in('resource_id', memberIds)
        .in('week_start_date', weekStartDates);

      if (allocationsError) {
        console.error('Error fetching project allocations:', allocationsError);
        throw allocationsError;
      }

      console.log('Fetched project allocations:', allocations?.length || 0);

      // Process project allocations
      if (allocations) {
        allocations.forEach(allocation => {
          const memberId = allocation.resource_id;
          const weekKey = allocation.week_start_date;
          const hours = allocation.hours || 0;
          
          if (result[memberId] && result[memberId][weekKey]) {
            result[memberId][weekKey].projectHours += hours;
            result[memberId][weekKey].total += hours;
            
            // Add project details
            if (allocation.projects && hours > 0) {
              const project: ProjectAllocation = {
                project_id: allocation.project_id,
                project_name: allocation.projects.name || 'Unknown Project',
                project_code: allocation.projects.code || 'Unknown Code',
                hours: hours
              };
              
              // Check if project already exists and sum hours
              const existingProjectIndex = result[memberId][weekKey].projects.findIndex(
                p => p.project_id === project.project_id
              );
              
              if (existingProjectIndex >= 0) {
                result[memberId][weekKey].projects[existingProjectIndex].hours += hours;
              } else {
                result[memberId][weekKey].projects.push(project);
              }
            }
          }
        });
      }

      // Fetch annual leave data
      const { data: annualLeaves, error: annualLeavesError } = await supabase
        .from('annual_leaves')
        .select('member_id, date, hours')
        .eq('company_id', company.id)
        .in('member_id', memberIds)
        .gte('date', weekStartDates[0])
        .lte('date', format(addWeeks(startOfWeek(addWeeks(startDate, numberOfWeeks - 1), { weekStartsOn: 1 }), 1), 'yyyy-MM-dd'));

      if (annualLeavesError) {
        console.error('Error fetching annual leaves:', annualLeavesError);
      } else if (annualLeaves) {
        annualLeaves.forEach(leave => {
          const weekStart = startOfWeek(new Date(leave.date), { weekStartsOn: 1 });
          const weekKey = format(weekStart, 'yyyy-MM-dd');
          const hours = leave.hours || 0;
          
          if (result[leave.member_id] && result[leave.member_id][weekKey]) {
            result[leave.member_id][weekKey].annualLeave += hours;
            result[leave.member_id][weekKey].total += hours;
          }
        });
      }

      // Fetch other leave data
      const { data: otherLeaves, error: otherLeavesError } = await supabase
        .from('weekly_other_leave')
        .select('member_id, week_start_date, hours')
        .eq('company_id', company.id)
        .in('member_id', memberIds)
        .in('week_start_date', weekStartDates);

      if (otherLeavesError) {
        console.error('Error fetching other leaves:', otherLeavesError);
      } else if (otherLeaves) {
        otherLeaves.forEach(leave => {
          const weekKey = leave.week_start_date;
          const hours = leave.hours || 0;
          
          if (result[leave.member_id] && result[leave.member_id][weekKey]) {
            result[leave.member_id][weekKey].otherLeave += hours;
            result[leave.member_id][weekKey].total += hours;
          }
        });
      }

      // Debug logging for specific member (Paul Julius)
      const paulMember = members.find(m => 
        m.first_name?.toLowerCase().includes('paul') || 
        m.last_name?.toLowerCase().includes('julius')
      );
      
      if (paulMember && result[paulMember.id]) {
        console.log(`Workload calculation for ${paulMember.first_name} ${paulMember.last_name}:`, {
          memberId: paulMember.id,
          weeklyData: Object.entries(result[paulMember.id]).slice(0, 5),
          june9Week: result[paulMember.id]['2024-06-03'] || result[paulMember.id]['2024-06-10'],
          allocationsSample: allocations?.filter(a => a.resource_id === paulMember.id).slice(0, 5)
        });
      }

      console.log('Completed workload data processing. Sample result:', {
        totalMembers: Object.keys(result).length,
        totalWeeks: weekStartDates.length,
        sampleMemberWeeks: Object.entries(result)[0]?.[1] ? Object.keys(Object.entries(result)[0][1]).length : 0,
        allocationsProcessed: allocations?.length || 0
      });

      return result;
    },
    enabled: !!company?.id && members.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    weeklyWorkloadData,
    isLoading,
    error
  };
};
