
import { useMemo, useCallback, useRef, useState, useEffect } from 'react';
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

  // Use simple state for stable data instead of refs with JSON comparison
  const [stableAllocations, setStableAllocations] = useState(comprehensiveWeeklyAllocations);
  const [stableLeaveDetails, setStableLeaveDetails] = useState(weeklyLeaveDetails);
  
  // Update stable data only when the length or first/last items change (simpler comparison)
  useEffect(() => {
    if (comprehensiveWeeklyAllocations.length !== stableAllocations.length ||
        (comprehensiveWeeklyAllocations.length > 0 && stableAllocations.length > 0 &&
         comprehensiveWeeklyAllocations[0]?.id !== stableAllocations[0]?.id)) {
      setStableAllocations(comprehensiveWeeklyAllocations);
    }
  }, [comprehensiveWeeklyAllocations, stableAllocations]);

  useEffect(() => {
    const newKeys = Object.keys(weeklyLeaveDetails);
    const oldKeys = Object.keys(stableLeaveDetails);
    if (newKeys.length !== oldKeys.length || newKeys.some(key => !oldKeys.includes(key))) {
      setStableLeaveDetails(weeklyLeaveDetails);
    }
  }, [weeklyLeaveDetails, stableLeaveDetails]);

  // Create allocation map - memoize to prevent unnecessary recalculations
  const allocationMap = useMemo(() => {
    const map = new Map<string, number>();
    stableAllocations.forEach(allocation => {
      const key = `${allocation.resource_id}:${allocation.project_id}`;
      map.set(key, allocation.hours || 0);
    });
    return map;
  }, [stableAllocations]);

  // Create stable callback functions with useCallback
  const getMemberTotal = useCallback((memberId: string) => {
    let total = 0;
    stableAllocations.forEach(allocation => {
      if (allocation.resource_id === memberId) {
        total += allocation.hours || 0;
      }
    });
    return total;
  }, [stableAllocations]);

  const getProjectCount = useCallback((memberId: string) => {
    const uniqueProjects = new Set<string>();
    stableAllocations.forEach(allocation => {
      if (allocation.resource_id === memberId && (allocation.hours || 0) > 0) {
        uniqueProjects.add(allocation.project_id);
      }
    });
    return uniqueProjects.size;
  }, [stableAllocations]);

  const getWeeklyLeave = useCallback((memberId: string): Array<{ date: string; hours: number }> => {
    return stableLeaveDetails[memberId] || [];
  }, [stableLeaveDetails]);

  const isLoading = isLoadingMembers || isLoadingProjects || isLoadingLeave || isLoadingOtherLeave;
  const error = membersError || null;

  // Return stable object - use refs to prevent recreation
  const returnValueRef = useRef({
    allMembers: [],
    projects: [],
    allocations: [],
    isLoading: true,
    error: null,
    allocationMap: new Map(),
    getMemberTotal: () => 0,
    getProjectCount: () => 0,
    getWeeklyLeave: () => [],
    annualLeaveData: {},
    holidaysData: {},
    otherLeaveData: {},
    updateOtherLeave: undefined
  });

  // Only update the return value when essential data changes
  const shouldUpdate = 
    returnValueRef.current.allMembers !== members ||
    returnValueRef.current.projects !== projects ||
    returnValueRef.current.isLoading !== isLoading ||
    returnValueRef.current.error !== error ||
    returnValueRef.current.annualLeaveData !== annualLeaveData ||
    returnValueRef.current.holidaysData !== holidaysData ||
    returnValueRef.current.otherLeaveData !== otherLeaveData ||
    returnValueRef.current.updateOtherLeave !== updateOtherLeave;

  if (shouldUpdate) {
    returnValueRef.current = {
      allMembers: members || [],
      projects: projects || [],
      allocations: stableAllocations,
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
    };
  }

  return returnValueRef.current;
};
