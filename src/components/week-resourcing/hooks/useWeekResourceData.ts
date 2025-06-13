
import { format, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';
import { useWeekResourceTeamMembers } from './useWeekResourceTeamMembers';
import { useWeekResourceProjects } from './useWeekResourceProjects';
import { useWeekResourceAllocations } from './useWeekResourceAllocations';
import { useWeekResourceLeaveData } from './useWeekResourceLeaveData';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';

interface UseWeekResourceDataProps {
  weekStartDate: string;
  filters: {
    office: string;
    searchTerm?: string;
  };
}

export const useWeekResourceData = (weekStartDate: string, filters: UseWeekResourceDataProps['filters']) => {
  const { company } = useCompany();
  
  // Get team members
  const {
    members,
    loadingMembers,
    membersError
  } = useWeekResourceTeamMembers();

  // Get projects for the company
  const {
    data: projects,
    isLoading: isLoadingProjects,
    error: projectsError
  } = useWeekResourceProjects({ filters });

  // Get resource allocations for the selected week
  const {
    data: weekAllocations,
    isLoading: isLoadingAllocations
  } = useWeekResourceAllocations({ weekStartDate });

  // Get leave data (annual leave and holidays)
  const memberIds = members.map(m => m.id);
  const {
    annualLeaveData,
    holidaysData,
    isLoading: isLoadingLeaveData
  } = useWeekResourceLeaveData({ weekStartDate, memberIds });

  // Fetch detailed annual leave data for the week to get individual dates
  const { data: weeklyLeaveDetails } = useQuery({
    queryKey: ['weekly-leave-details', weekStartDate, company?.id, memberIds],
    queryFn: async () => {
      if (!company?.id || memberIds.length === 0) return {};

      const weekStart = new Date(weekStartDate);
      const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });

      console.log('Fetching detailed annual leave for week:', weekStartDate);

      const { data, error } = await supabase
        .from('annual_leaves')
        .select('member_id, date, hours')
        .eq('company_id', company.id)
        .in('member_id', memberIds)
        .gte('date', format(weekStart, 'yyyy-MM-dd'))
        .lte('date', format(weekEnd, 'yyyy-MM-dd'));

      if (error) {
        console.error('Error fetching detailed annual leave:', error);
        return {};
      }

      // Group by member
      const leaveByMember: Record<string, Array<{ date: string; hours: number }>> = {};
      data?.forEach(leave => {
        if (!leaveByMember[leave.member_id]) {
          leaveByMember[leave.member_id] = [];
        }
        leaveByMember[leave.member_id].push({
          date: leave.date,
          hours: Number(leave.hours) || 0
        });
      });

      console.log('Detailed leave data processed:', leaveByMember);
      return leaveByMember;
    },
    enabled: !!company?.id && memberIds.length > 0
  });

  // Fetch weekly resource allocations to calculate weekly totals
  const { data: weeklyResourceAllocations } = useQuery({
    queryKey: ['weekly-resource-allocations', weekStartDate, company?.id, memberIds],
    queryFn: async () => {
      if (!company?.id || memberIds.length === 0) return [];

      console.log('Fetching weekly resource allocations for week:', weekStartDate);

      const { data, error } = await supabase
        .from('project_resource_allocations')
        .select('resource_id, project_id, hours')
        .eq('company_id', company.id)
        .in('resource_id', memberIds)
        .eq('week_start_date', weekStartDate);

      if (error) {
        console.error('Error fetching weekly resource allocations:', error);
        return [];
      }

      console.log('Weekly resource allocations fetched:', data?.length || 0);
      return data || [];
    },
    enabled: !!company?.id && memberIds.length > 0
  });

  // Create allocation map for easy lookup
  const allocationMap = new Map<string, number>();
  if (weekAllocations) {
    weekAllocations.forEach(allocation => {
      const key = `${allocation.resource_id}:${allocation.project_id}`;
      allocationMap.set(key, allocation.hours);
    });
  }

  // Calculate weekly totals per member from weekly resource allocations
  const memberWeeklyTotals = new Map<string, number>();
  if (weeklyResourceAllocations) {
    weeklyResourceAllocations.forEach(allocation => {
      const memberId = allocation.resource_id;
      const currentTotal = memberWeeklyTotals.get(memberId) || 0;
      memberWeeklyTotals.set(memberId, currentTotal + (Number(allocation.hours) || 0));
    });
  }

  console.log('Member weekly totals calculated:', Object.fromEntries(memberWeeklyTotals));

  // Utility function to get member total hours - now uses weekly calculation
  const getMemberTotal = (memberId: string): number => {
    const total = memberWeeklyTotals.get(memberId) || 0;
    console.log(`Member ${memberId} weekly total hours:`, total);
    return total;
  };

  // Utility function to get project count for a member
  const getProjectCount = (memberId: string): number => {
    let count = 0;
    if (weeklyResourceAllocations) {
      // Count unique projects this member is allocated to during the week
      const memberProjects = new Set();
      weeklyResourceAllocations
        .filter(allocation => allocation.resource_id === memberId && (Number(allocation.hours) || 0) > 0)
        .forEach(allocation => memberProjects.add(allocation.project_id));
      count = memberProjects.size;
    }
    console.log(`Member ${memberId} project count:`, count);
    return count;
  };

  // Utility function to get weekly leave dates - now properly implemented
  const getWeeklyLeave = (memberId: string): Array<{ date: string; hours: number }> => {
    if (!weeklyLeaveDetails || !weeklyLeaveDetails[memberId]) {
      return [];
    }
    
    // Sort by date and return
    return weeklyLeaveDetails[memberId].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  };

  // Determine overall loading state
  const isLoading = isLoadingProjects || loadingMembers || isLoadingAllocations || isLoadingLeaveData;
  
  // Handle errors
  const error = projectsError || membersError;

  return {
    projects: projects || [],
    members,
    allocations: weekAllocations || [],
    allocationMap,
    getMemberTotal,
    getProjectCount,
    getWeeklyLeave,
    annualLeaveData,
    holidaysData,
    weekStartDate,
    isLoading,
    error
  };
};
