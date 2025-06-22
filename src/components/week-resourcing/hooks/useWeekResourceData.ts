
import { useMemo, useCallback } from 'react';
import { useWeekResourceTeamMembers } from './useWeekResourceTeamMembers';
import { useWeekResourceProjects } from './useWeekResourceProjects';
import { useComprehensiveAllocations } from './useComprehensiveAllocations';
import { useWeekResourceLeaveData } from './useWeekResourceLeaveData';
import { useWeeklyLeaveDetails } from './useWeeklyLeaveDetails';
import { useWeeklyOtherLeaveData } from './useWeeklyOtherLeaveData';
import { format } from 'date-fns';

export const useWeekResourceData = (selectedWeek: Date, filters: any) => {
  // Convert Date to string format for API calls
  const weekStartDate = useMemo(() => format(selectedWeek, 'yyyy-MM-dd'), [selectedWeek]);
  
  // Fetch team members
  const { members, loadingMembers: isLoadingMembers, membersError } = useWeekResourceTeamMembers();
  
  // Fetch projects
  const { data: projects = [], isLoading: isLoadingProjects } = useWeekResourceProjects({ filters });
  
  // Extract member IDs for allocations and leave data
  const memberIds = useMemo(() => members?.map(member => member.id) || [], [members]);
  
  // Fetch allocations
  const { comprehensiveWeeklyAllocations = [] } = useComprehensiveAllocations({ 
    weekStartDate, 
    memberIds 
  });
  
  // Fetch leave data
  const { 
    annualLeaveData = {}, 
    holidaysData = {}, 
    isLoading: isLoadingLeave 
  } = useWeekResourceLeaveData({ 
    weekStartDate, 
    memberIds 
  });

  // Fetch detailed leave data for proper formatting
  const { weeklyLeaveDetails = {} } = useWeeklyLeaveDetails({ 
    weekStartDate, 
    memberIds 
  });

  // Fetch other leave data with update functionality
  const { 
    otherLeaveData = {}, 
    isLoading: isLoadingOtherLeave,
    updateOtherLeave 
  } = useWeeklyOtherLeaveData(weekStartDate, memberIds);

  // Create allocation map with stable reference
  const allocationMap = useMemo(() => {
    const map = new Map<string, number>();
    comprehensiveWeeklyAllocations.forEach(allocation => {
      const key = `${allocation.resource_id}:${allocation.project_id}`;
      map.set(key, allocation.hours || 0);
    });
    return map;
  }, [comprehensiveWeeklyAllocations]);

  // Calculate member totals with stable callback
  const getMemberTotal = useCallback((memberId: string) => {
    let total = 0;
    comprehensiveWeeklyAllocations.forEach(allocation => {
      if (allocation.resource_id === memberId) {
        total += allocation.hours || 0;
      }
    });
    return total;
  }, [comprehensiveWeeklyAllocations]);

  // Calculate project count per member with stable callback
  const getProjectCount = useCallback((memberId: string) => {
    const uniqueProjects = new Set<string>();
    comprehensiveWeeklyAllocations.forEach(allocation => {
      if (allocation.resource_id === memberId && (allocation.hours || 0) > 0) {
        uniqueProjects.add(allocation.project_id);
      }
    });
    return uniqueProjects.size;
  }, [comprehensiveWeeklyAllocations]);

  // Create a proper getWeeklyLeave function with stable callback
  const getWeeklyLeave = useCallback((memberId: string): Array<{ date: string; hours: number }> => {
    return weeklyLeaveDetails[memberId] || [];
  }, [weeklyLeaveDetails]);

  const isLoading = isLoadingMembers || isLoadingProjects || isLoadingLeave || isLoadingOtherLeave;
  const error = membersError || null;

  // Return memoized object to prevent unnecessary rerenders
  return useMemo(() => ({
    allMembers: members || [],
    projects,
    allocations: comprehensiveWeeklyAllocations,
    isLoading,
    error,
    allocationMap,
    getMemberTotal,
    getProjectCount,
    getWeeklyLeave,
    annualLeaveData,
    holidaysData,
    otherLeaveData,
    updateOtherLeave
  }), [
    members,
    projects,
    comprehensiveWeeklyAllocations,
    isLoading,
    error,
    allocationMap,
    getMemberTotal,
    getProjectCount,
    getWeeklyLeave,
    annualLeaveData,
    holidaysData,
    otherLeaveData,
    updateOtherLeave
  ]);
};
