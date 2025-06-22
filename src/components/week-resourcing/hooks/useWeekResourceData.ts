
import { useMemo, useCallback } from 'react';
import { useWeekResourceTeamMembers } from './useWeekResourceTeamMembers';
import { useWeekResourceProjects } from './useWeekResourceProjects';
import { useComprehensiveAllocations } from './useComprehensiveAllocations';
import { useWeekResourceLeaveData } from './useWeekResourceLeaveData';
import { useWeeklyLeaveDetails } from './useWeeklyLeaveDetails';
import { useWeeklyOtherLeaveData } from './useWeeklyOtherLeaveData';
import { format } from 'date-fns';

export const useWeekResourceData = (selectedWeek: Date, filters: any) => {
  // Convert Date to string format for API calls - make this stable
  const weekStartDate = useMemo(() => format(selectedWeek, 'yyyy-MM-dd'), [selectedWeek]);
  
  // Fetch team members
  const { members, loadingMembers: isLoadingMembers, membersError } = useWeekResourceTeamMembers();
  
  // Fetch projects with stable filters
  const { data: projects = [], isLoading: isLoadingProjects } = useWeekResourceProjects({ filters });
  
  // Create stable member IDs array
  const memberIds = useMemo(() => {
    if (!members || members.length === 0) return [];
    return members.map(member => member.id);
  }, [members]);
  
  // Only fetch allocations and leave data when we have member IDs
  const shouldFetchData = memberIds.length > 0;
  
  // Fetch allocations only when we have members
  const { comprehensiveWeeklyAllocations = [] } = useComprehensiveAllocations({ 
    weekStartDate, 
    memberIds: shouldFetchData ? memberIds : []
  });
  
  // Fetch leave data only when we have members
  const { 
    annualLeaveData = {}, 
    holidaysData = {}, 
    isLoading: isLoadingLeave 
  } = useWeekResourceLeaveData({ 
    weekStartDate, 
    memberIds: shouldFetchData ? memberIds : []
  });

  // Fetch detailed leave data only when we have members
  const { weeklyLeaveDetails = {} } = useWeeklyLeaveDetails({ 
    weekStartDate, 
    memberIds: shouldFetchData ? memberIds : []
  });

  // Fetch other leave data only when we have members
  const { 
    otherLeaveData = {}, 
    isLoading: isLoadingOtherLeave,
    updateOtherLeave 
  } = useWeeklyOtherLeaveData(weekStartDate, shouldFetchData ? memberIds : []);

  // Create stable allocation map
  const allocationMap = useMemo(() => {
    const map = new Map<string, number>();
    if (comprehensiveWeeklyAllocations.length > 0) {
      comprehensiveWeeklyAllocations.forEach(allocation => {
        const key = `${allocation.resource_id}:${allocation.project_id}`;
        map.set(key, allocation.hours || 0);
      });
    }
    return map;
  }, [comprehensiveWeeklyAllocations]);

  // Create stable member totals map
  const memberTotalsMap = useMemo(() => {
    const totalsMap = new Map<string, number>();
    if (comprehensiveWeeklyAllocations.length > 0) {
      comprehensiveWeeklyAllocations.forEach(allocation => {
        const current = totalsMap.get(allocation.resource_id) || 0;
        totalsMap.set(allocation.resource_id, current + (allocation.hours || 0));
      });
    }
    return totalsMap;
  }, [comprehensiveWeeklyAllocations]);

  // Create stable project count map
  const projectCountMap = useMemo(() => {
    const projectSetsMap = new Map<string, Set<string>>();
    
    if (comprehensiveWeeklyAllocations.length > 0) {
      comprehensiveWeeklyAllocations.forEach(allocation => {
        if ((allocation.hours || 0) > 0) {
          const current = projectSetsMap.get(allocation.resource_id) || new Set<string>();
          current.add(allocation.project_id);
          projectSetsMap.set(allocation.resource_id, current);
        }
      });
    }
    
    // Convert sets to counts
    const finalCountMap = new Map<string, number>();
    projectSetsMap.forEach((projectSet, memberId) => {
      finalCountMap.set(memberId, projectSet.size);
    });
    
    return finalCountMap;
  }, [comprehensiveWeeklyAllocations]);

  // Stable callback functions
  const getMemberTotal = useCallback((memberId: string) => {
    return memberTotalsMap.get(memberId) || 0;
  }, [memberTotalsMap]);

  const getProjectCount = useCallback((memberId: string) => {
    return projectCountMap.get(memberId) || 0;
  }, [projectCountMap]);

  const getWeeklyLeave = useCallback((memberId: string): Array<{ date: string; hours: number }> => {
    return weeklyLeaveDetails[memberId] || [];
  }, [weeklyLeaveDetails]);

  // Consolidate loading state - only show loading if members are loading OR if we have members but other data is still loading
  const isLoading = useMemo(() => {
    if (isLoadingMembers || isLoadingProjects) return true;
    if (shouldFetchData && (isLoadingLeave || isLoadingOtherLeave)) return true;
    return false;
  }, [isLoadingMembers, isLoadingProjects, shouldFetchData, isLoadingLeave, isLoadingOtherLeave]);

  const error = membersError || null;

  // Return stable object with all computed values
  const result = useMemo(() => ({
    allMembers: members || [],
    projects: projects || [],
    allocations: comprehensiveWeeklyAllocations || [],
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

  // Debug logging
  console.log('useWeekResourceData hook:', {
    weekStartDate,
    membersCount: members?.length || 0,
    memberIds: memberIds.length,
    shouldFetchData,
    allocationsCount: comprehensiveWeeklyAllocations.length,
    allocationMapSize: allocationMap.size,
    isLoadingMembers,
    isLoadingProjects,
    isLoadingLeave,
    isLoadingOtherLeave,
    finalIsLoading: isLoading
  });

  return result;
};
