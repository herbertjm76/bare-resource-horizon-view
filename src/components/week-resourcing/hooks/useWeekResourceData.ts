
import { format, startOfWeek } from 'date-fns';
import { useWeekResourceTeamMembers } from './useWeekResourceTeamMembers';
import { useWeekResourceProjects } from './useWeekResourceProjects';
import { useWeekResourceAllocations } from './useWeekResourceAllocations';
import { useWeekResourceLeaveData } from './useWeekResourceLeaveData';

interface UseWeekResourceDataProps {
  weekStartDate: string;
  filters: {
    office: string;
    searchTerm?: string;
  };
}

export const useWeekResourceData = (weekStartDate: string, filters: UseWeekResourceDataProps['filters']) => {
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

  // Create allocation map for easy lookup
  const allocationMap = new Map<string, number>();
  if (weekAllocations) {
    weekAllocations.forEach(allocation => {
      const key = `${allocation.resource_id}:${allocation.project_id}`;
      allocationMap.set(key, allocation.hours);
    });
  }

  // Utility function to get member total hours
  const getMemberTotal = (memberId: string): number => {
    let total = 0;
    if (projects) {
      projects.forEach(project => {
        const key = `${memberId}:${project.id}`;
        total += allocationMap.get(key) || 0;
      });
    }
    return total;
  };

  // Utility function to get project count for a member
  const getProjectCount = (memberId: string): number => {
    let count = 0;
    if (projects) {
      projects.forEach(project => {
        const key = `${memberId}:${project.id}`;
        if ((allocationMap.get(key) || 0) > 0) {
          count++;
        }
      });
    }
    return count;
  };

  // Utility function to get weekly leave dates
  const getWeeklyLeave = (memberId: string): Array<{ date: string; hours: number }> => {
    // This would need to be implemented based on your annual leave data structure
    // For now, return empty array as placeholder
    return [];
  };

  // Determine overall loading state
  const isLoading = isLoadingProjects || loadingMembers || isLoadingAllocations || isLoadingLeaveData;
  
  // Handle errors
  const error = projectsError || membersError;

  return {
    projects: projects || [],
    members,
    allocations: weekAllocations || [], // Renamed from weekAllocations to allocations
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
