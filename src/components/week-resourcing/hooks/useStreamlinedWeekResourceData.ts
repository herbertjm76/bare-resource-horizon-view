
import { useMemo, useCallback } from 'react';
import { useWeekResourceTeamMembers } from './useWeekResourceTeamMembers';
import { useWeekResourceProjects } from './useWeekResourceProjects';
import { useComprehensiveAllocations } from './useComprehensiveAllocations';
import { useWeekResourceLeaveData } from './useWeekResourceLeaveData';
import { useWeeklyLeaveDetails } from './useWeeklyLeaveDetails';
import { useWeeklyOtherLeaveData } from './useWeeklyOtherLeaveData';
import { format } from 'date-fns';

export const useStreamlinedWeekResourceData = (selectedWeek: Date, filters: any) => {
  // Convert Date to string format for API calls - make this stable
  const weekStartDate = useMemo(() => format(selectedWeek, 'yyyy-MM-dd'), [selectedWeek]);
  
  // Fetch team members first - this is the foundation
  const { members, loadingMembers, membersError } = useWeekResourceTeamMembers();
  
  // Only proceed with other data fetching if we have members
  const memberIds = useMemo(() => {
    return members?.map(member => member.id) || [];
  }, [members]);

  const shouldFetchData = memberIds.length > 0 && !loadingMembers;
  
  // Fetch projects - independent of members
  const { data: projects = [], isLoading: isLoadingProjects } = useWeekResourceProjects({ 
    filters,
    enabled: true // Always fetch projects
  });
  
  // Fetch allocations - depends on members
  const { comprehensiveWeeklyAllocations = [] } = useComprehensiveAllocations({ 
    weekStartDate, 
    memberIds: shouldFetchData ? memberIds : [],
    enabled: shouldFetchData
  });
  
  // Fetch leave data - depends on members
  const { 
    annualLeaveData = {}, 
    holidaysData = {}, 
    isLoading: isLoadingLeave 
  } = useWeekResourceLeaveData({ 
    weekStartDate, 
    memberIds: shouldFetchData ? memberIds : [],
    enabled: shouldFetchData
  });

  // Fetch detailed leave data - depends on members
  const { weeklyLeaveDetails = {} } = useWeeklyLeaveDetails({ 
    weekStartDate, 
    memberIds: shouldFetchData ? memberIds : [],
    enabled: shouldFetchData
  });

  // Fetch other leave data - depends on members
  const { 
    otherLeaveData = {}, 
    isLoading: isLoadingOtherLeave,
    updateOtherLeave 
  } = useWeeklyOtherLeaveData(
    weekStartDate, 
    shouldFetchData ? memberIds : [],
    shouldFetchData
  );

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

  // Simplified loading state - only show loading if members are loading or if we have members but no allocation data yet
  const isLoading = useMemo(() => {
    // Always loading if members are loading
    if (loadingMembers) return true;
    
    // If we have no members, we're not loading
    if (!members || members.length === 0) return false;
    
    // We have members, check if we're still loading critical data
    const criticalDataLoading = isLoadingProjects || (shouldFetchData && (isLoadingLeave || isLoadingOtherLeave));
    
    return criticalDataLoading;
  }, [loadingMembers, members, isLoadingProjects, shouldFetchData, isLoadingLeave, isLoadingOtherLeave]);

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

  // Only log when data state changes meaningfully
  console.log('Streamlined WeekResourceData:', {
    weekStartDate,
    membersCount: members?.length || 0,
    projectsCount: projects?.length || 0,
    allocationsCount: comprehensiveWeeklyAllocations?.length || 0,
    allocationMapSize: allocationMap.size,
    isLoading,
    shouldFetchData
  });

  return result;
};
