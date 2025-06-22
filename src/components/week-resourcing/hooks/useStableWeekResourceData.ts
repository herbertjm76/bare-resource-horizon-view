
import { useMemo, useCallback, useRef } from 'react';
import { useWeekResourceTeamMembers } from './useWeekResourceTeamMembers';
import { useWeekResourceProjects } from './useWeekResourceProjects';
import { useComprehensiveAllocations } from './useComprehensiveAllocations';
import { useWeekResourceLeaveData } from './useWeekResourceLeaveData';
import { useWeeklyLeaveDetails } from './useWeeklyLeaveDetails';
import { useWeeklyOtherLeaveData } from './useWeeklyOtherLeaveData';
import { format } from 'date-fns';

export const useStableWeekResourceData = (selectedWeek: Date, filters: any) => {
  // Convert Date to string format for API calls - memoize to prevent unnecessary changes
  const weekStartDate = useMemo(() => format(selectedWeek, 'yyyy-MM-dd'), [selectedWeek]);
  
  // Fetch team members
  const { members, loadingMembers: isLoadingMembers, membersError } = useWeekResourceTeamMembers();
  
  // Fetch projects
  const { data: projects = [], isLoading: isLoadingProjects } = useWeekResourceProjects({ filters });
  
  // Extract member IDs for allocations and leave data - memoize to prevent unnecessary changes
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

  // Create stable references using useRef to prevent recreation
  const stableAllocationsRef = useRef(comprehensiveWeeklyAllocations);
  const stableWeeklyLeaveDetailsRef = useRef(weeklyLeaveDetails);
  
  // Only update refs when data actually changes
  useMemo(() => {
    if (JSON.stringify(stableAllocationsRef.current) !== JSON.stringify(comprehensiveWeeklyAllocations)) {
      stableAllocationsRef.current = comprehensiveWeeklyAllocations;
    }
  }, [comprehensiveWeeklyAllocations]);

  useMemo(() => {
    if (JSON.stringify(stableWeeklyLeaveDetailsRef.current) !== JSON.stringify(weeklyLeaveDetails)) {
      stableWeeklyLeaveDetailsRef.current = weeklyLeaveDetails;
    }
  }, [weeklyLeaveDetails]);

  // Create allocation map - memoize to prevent unnecessary recalculations
  const allocationMap = useMemo(() => {
    const map = new Map<string, number>();
    stableAllocationsRef.current.forEach(allocation => {
      const key = `${allocation.resource_id}:${allocation.project_id}`;
      map.set(key, allocation.hours || 0);
    });
    return map;
  }, [stableAllocationsRef.current]);

  // Create stable callback functions with useCallback and dependency on refs
  const getMemberTotal = useCallback((memberId: string) => {
    let total = 0;
    stableAllocationsRef.current.forEach(allocation => {
      if (allocation.resource_id === memberId) {
        total += allocation.hours || 0;
      }
    });
    return total;
  }, []);

  const getProjectCount = useCallback((memberId: string) => {
    const uniqueProjects = new Set<string>();
    stableAllocationsRef.current.forEach(allocation => {
      if (allocation.resource_id === memberId && (allocation.hours || 0) > 0) {
        uniqueProjects.add(allocation.project_id);
      }
    });
    return uniqueProjects.size;
  }, []);

  const getWeeklyLeave = useCallback((memberId: string): Array<{ date: string; hours: number }> => {
    return stableWeeklyLeaveDetailsRef.current[memberId] || [];
  }, []);

  const isLoading = isLoadingMembers || isLoadingProjects || isLoadingLeave || isLoadingOtherLeave;
  const error = membersError || null;

  // Create a completely stable return object
  const stableReturnValue = useMemo(() => ({
    allMembers: members || [],
    projects: projects || [],
    allocations: stableAllocationsRef.current,
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

  return stableReturnValue;
};
