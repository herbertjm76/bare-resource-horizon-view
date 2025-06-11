
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

  // Create allocation map for easy lookup
  const allocationMap = new Map<string, number>();
  if (weekAllocations) {
    weekAllocations.forEach(allocation => {
      const key = `${allocation.resource_id}:${allocation.project_id}`;
      allocationMap.set(key, allocation.hours);
    });
  }

  // Create a map of total hours per member from all their allocations
  const memberTotalHoursMap = new Map<string, number>();
  if (weekAllocations) {
    weekAllocations.forEach(allocation => {
      const memberId = allocation.resource_id;
      const currentTotal = memberTotalHoursMap.get(memberId) || 0;
      memberTotalHoursMap.set(memberId, currentTotal + allocation.hours);
    });
  }

  // Utility function to get member total hours - now uses the comprehensive calculation
  const getMemberTotal = (memberId: string): number => {
    const total = memberTotalHoursMap.get(memberId) || 0;
    console.log(`Member ${memberId} total hours:`, total);
    return total;
  };

  // Utility function to get project count for a member
  const getProjectCount = (memberId: string): number => {
    let count = 0;
    if (weekAllocations) {
      const memberAllocations = weekAllocations.filter(allocation => 
        allocation.resource_id === memberId && allocation.hours > 0
      );
      count = memberAllocations.length;
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
