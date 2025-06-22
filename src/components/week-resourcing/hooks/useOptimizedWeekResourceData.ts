
import { useMemo, useCallback, useRef } from 'react';
import { useWeekResourceTeamMembers } from './useWeekResourceTeamMembers';
import { useWeekResourceProjects } from './useWeekResourceProjects';
import { useComprehensiveAllocations } from './useComprehensiveAllocations';
import { useWeekResourceLeaveData } from './useWeekResourceLeaveData';
import { useWeeklyLeaveDetails } from './useWeeklyLeaveDetails';
import { useWeeklyOtherLeaveData } from './useWeeklyOtherLeaveData';
import { format } from 'date-fns';

export const useOptimizedWeekResourceData = (selectedWeek: Date, filters: any) => {
  // Convert Date to string format for API calls - memoize to prevent unnecessary changes
  const weekStartDate = useMemo(() => format(selectedWeek, 'yyyy-MM-dd'), [selectedWeek]);
  
  // Fetch team members
  const { members, loadingMembers: isLoadingMembers, membersError } = useWeekResourceTeamMembers();
  
  // Fetch projects
  const { data: projects = [], isLoading: isLoadingProjects } = useWeekResourceProjects({ filters });
  
  // Extract member IDs for allocations and leave data - memoize to prevent unnecessary changes
  const memberIds = useMemo(() => {
    if (!members || members.length === 0) return [];
    return members.map(member => member.id);
  }, [members]);
  
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

  // Create allocation map - use useRef to prevent recreation unless data actually changes
  const prevAllocationsRef = useRef(comprehensiveWeeklyAllocations);
  const allocationMapRef = useRef(new Map<string, number>());
  
  if (prevAllocationsRef.current !== comprehensiveWeeklyAllocations) {
    const newMap = new Map<string, number>();
    comprehensiveWeeklyAllocations.forEach(allocation => {
      const key = `${allocation.resource_id}:${allocation.project_id}`;
      newMap.set(key, allocation.hours || 0);
    });
    allocationMapRef.current = newMap;
    prevAllocationsRef.current = comprehensiveWeeklyAllocations;
  }

  // Create stable callback functions - use useRef to prevent recreation
  const getMemberTotalRef = useRef((memberId: string) => {
    let total = 0;
    comprehensiveWeeklyAllocations.forEach(allocation => {
      if (allocation.resource_id === memberId) {
        total += allocation.hours || 0;
      }
    });
    return total;
  });

  const getProjectCountRef = useRef((memberId: string) => {
    const uniqueProjects = new Set<string>();
    comprehensiveWeeklyAllocations.forEach(allocation => {
      if (allocation.resource_id === memberId && (allocation.hours || 0) > 0) {
        uniqueProjects.add(allocation.project_id);
      }
    });
    return uniqueProjects.size;
  });

  const getWeeklyLeaveRef = useRef((memberId: string): Array<{ date: string; hours: number }> => {
    return weeklyLeaveDetails[memberId] || [];
  });

  // Update callback functions when data changes
  if (prevAllocationsRef.current === comprehensiveWeeklyAllocations) {
    getMemberTotalRef.current = (memberId: string) => {
      let total = 0;
      comprehensiveWeeklyAllocations.forEach(allocation => {
        if (allocation.resource_id === memberId) {
          total += allocation.hours || 0;
        }
      });
      return total;
    };

    getProjectCountRef.current = (memberId: string) => {
      const uniqueProjects = new Set<string>();
      comprehensiveWeeklyAllocations.forEach(allocation => {
        if (allocation.resource_id === memberId && (allocation.hours || 0) > 0) {
          uniqueProjects.add(allocation.project_id);
        }
      });
      return uniqueProjects.size;
    };
  }

  // Update leave callback when leave details change
  const prevLeaveDetailsRef = useRef(weeklyLeaveDetails);
  if (prevLeaveDetailsRef.current !== weeklyLeaveDetails) {
    getWeeklyLeaveRef.current = (memberId: string): Array<{ date: string; hours: number }> => {
      return weeklyLeaveDetails[memberId] || [];
    };
    prevLeaveDetailsRef.current = weeklyLeaveDetails;
  }

  const isLoading = isLoadingMembers || isLoadingProjects || isLoadingLeave || isLoadingOtherLeave;
  const error = membersError || null;

  // Return stable object using useMemo with proper dependencies
  return useMemo(() => ({
    allMembers: members || [],
    projects: projects || [],
    allocations: comprehensiveWeeklyAllocations,
    isLoading,
    error,
    allocationMap: allocationMapRef.current,
    getMemberTotal: getMemberTotalRef.current,
    getProjectCount: getProjectCountRef.current,
    getWeeklyLeave: getWeeklyLeaveRef.current,
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
    annualLeaveData,
    holidaysData,
    otherLeaveData,
    updateOtherLeave
  ]);
};
