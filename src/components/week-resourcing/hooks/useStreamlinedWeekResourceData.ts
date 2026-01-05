
import { useMemo, useCallback } from 'react';
import { useWeekResourceTeamMembers } from './useWeekResourceTeamMembers';
import { useWeekResourceProjects } from './useWeekResourceProjects';
import { useDetailedWeeklyAllocations } from './useDetailedWeeklyAllocations';
import { useWeekResourceLeaveData } from './useWeekResourceLeaveData';
import { useWeeklyLeaveDetails } from './useWeeklyLeaveDetails';
import { useWeeklyOtherLeaveData } from './useWeeklyOtherLeaveData';
import { useAppSettings } from '@/hooks/useAppSettings';
import { format, startOfWeek } from 'date-fns';

type SortOption = 'alphabetical' | 'utilization' | 'location' | 'department';

export const useStreamlinedWeekResourceData = (selectedWeek: Date, filters: any, sortOption: SortOption = 'alphabetical') => {
  const { workWeekHours } = useAppSettings();
  // IMPORTANT: selectedWeek can be any day within the week; normalize to week start (Mon)
  const weekStartDate = useMemo(
    () => format(startOfWeek(selectedWeek, { weekStartsOn: 1 }), 'yyyy-MM-dd'),
    [selectedWeek]
  );
  // Fetch team members first - this is the foundation (fetch ALL members, filtering happens in WeekResourceView)
  const { members: allFetchedMembers, loadingMembers, membersError } = useWeekResourceTeamMembers();
  
  // Get ALL member IDs for data fetching (fetch data for all members upfront)
  const allMemberIds = useMemo(() => {
    return allFetchedMembers?.map(member => member.id) || [];
  }, [allFetchedMembers]);

  const shouldFetchData = allMemberIds.length > 0 && !loadingMembers;
  
  // Apply filters client-side for instant filtering without refetching
  const filteredMembers = useMemo(() => {
    if (!allFetchedMembers) return [];
    
    return allFetchedMembers.filter(member => {
      if (filters?.department && filters.department !== 'all' && member.department !== filters.department) {
        return false;
      }
      if (filters?.location && filters.location !== 'all' && member.location !== filters.location) {
        return false;
      }
      if (filters?.practiceArea && filters.practiceArea !== 'all' && member.practice_area !== filters.practiceArea) {
        return false;
      }
      return true;
    });
  }, [allFetchedMembers, filters?.department, filters?.location, filters?.practiceArea]);
  
  // Fetch projects - independent of members
  const { data: projects = [], isLoading: isLoadingProjects } = useWeekResourceProjects({ 
    filters,
    enabled: true // Always fetch projects
  });
  
  // Fetch allocations for ALL members - FIXED: Use detailed allocations that fetch all 7 days of the week
  const { data: detailedAllocations, isLoading: isLoadingAllocations } = useDetailedWeeklyAllocations(
    selectedWeek, 
    shouldFetchData ? allMemberIds : []
  );
  
  // Fetch leave data for ALL members
  const { 
    annualLeaveData = {}, 
    holidaysData = {}, 
    isLoading: isLoadingLeave 
  } = useWeekResourceLeaveData({ 
    weekStartDate, 
    memberIds: shouldFetchData ? allMemberIds : [],
    enabled: shouldFetchData
  });

  // Fetch detailed leave data for ALL members
  const { weeklyLeaveDetails = {} } = useWeeklyLeaveDetails({ 
    weekStartDate, 
    memberIds: shouldFetchData ? allMemberIds : [],
    enabled: shouldFetchData
  });

  // Fetch other leave data for ALL members
  const { 
    otherLeaveData = {}, 
    isLoading: isLoadingOtherLeave,
    updateOtherLeave 
  } = useWeeklyOtherLeaveData(
    weekStartDate, 
    shouldFetchData ? allMemberIds : [],
    shouldFetchData
  );

  // Create stable allocation map - Use detailed allocations that have proper daily breakdowns
  const allocationMap = useMemo(() => {
    const map = new Map<string, number>();
    
    if (detailedAllocations) {
      Object.values(detailedAllocations).forEach(memberData => {
        memberData.projects.forEach(project => {
          const key = `${memberData.member_id}:${project.project_id}`;
          const totalHours = project.total_hours;
          map.set(key, totalHours);
        });
      });
    }
    
    return map;
  }, [detailedAllocations]);

  // Create stable member totals map - Use detailed allocations for accurate totals
  const memberTotalsMap = useMemo(() => {
    const totalsMap = new Map<string, number>();
    
    if (detailedAllocations) {
      Object.values(detailedAllocations).forEach(memberData => {
        totalsMap.set(memberData.member_id, memberData.total_hours);
      });
    }
    
    return totalsMap;
  }, [detailedAllocations]);

  // Create stable project count map - count unique projects per member from detailed allocations
  const projectCountMap = useMemo(() => {
    const finalCountMap = new Map<string, number>();
    
    if (detailedAllocations) {
      Object.values(detailedAllocations).forEach(memberData => {
        // Count projects with hours > 0
        const projectCount = memberData.projects.filter(p => p.total_hours > 0).length;
        finalCountMap.set(memberData.member_id, projectCount);
      });
    }
    
    return finalCountMap;
  }, [detailedAllocations]);

  // Fixed callback functions - directly use the maps instead of depending on changing references
  const getMemberTotal = useCallback((memberId: string) => {
    return memberTotalsMap.get(memberId) || 0;
  }, [memberTotalsMap]);

  // Separate function for rundown data that returns detailed structure with REAL leave data
  const getMemberTotalForRundown = useCallback((memberId: string) => {
    const total = memberTotalsMap.get(memberId) || 0;
    
    // Get project allocations for this member from detailed allocations
    const memberData = detailedAllocations?.[memberId];
    const projectAllocations = memberData?.projects?.map(project => {
      // Find project details to get name and code
      const projectDetails = projects?.find(p => p.id === project.project_id);
      return {
        projectId: project.project_id,
        // Prefer full project record, fall back to allocation's own name/code, then generic label
        projectName: projectDetails?.name || project.project_name || 'Unknown Project',
        projectCode: projectDetails?.code || project.project_code || 'UNK',
        hours: project.total_hours,
        allocationId: project.allocation_id // Include the allocation ID
      };
    }) || [];
    
    // Get REAL leave data from the fetched leave details
    const memberLeaveDetails = weeklyLeaveDetails[memberId] || [];
    const annualLeaveHours = memberLeaveDetails.reduce((sum, leave) => sum + leave.hours, 0);
    
    const holidayHours = holidaysData[memberId] || 0;
    const otherLeaveHours = otherLeaveData[memberId] || 0;
    
    // Return the expected structure for rundown data with REAL data
    return {
      resourcedHours: total,
      projectAllocations,
      annualLeave: annualLeaveHours,
      vacationLeave: 0, // Not tracked separately in current schema
      medicalLeave: otherLeaveHours, // Other leave includes medical
      publicHoliday: holidayHours
    };
  }, [memberTotalsMap, detailedAllocations, projects, weeklyLeaveDetails, holidaysData, otherLeaveData]);

  const getProjectCount = useCallback((memberId: string) => {
    return projectCountMap.get(memberId) || 0;
  }, [projectCountMap]);

  const getWeeklyLeave = useCallback((memberId: string): Array<{ date: string; hours: number }> => {
    return weeklyLeaveDetails[memberId] || [];
  }, [weeklyLeaveDetails]);

  // Apply sorting to filtered members - centralized sorting logic
  // This is the SINGLE SOURCE OF TRUTH for member ordering
  const members = useMemo(() => {
    if (!filteredMembers || filteredMembers.length === 0) return [];
    
    return [...filteredMembers].sort((a, b) => {
      const nameA = `${a.first_name || ''} ${a.last_name || ''}`.trim().toLowerCase();
      const nameB = `${b.first_name || ''} ${b.last_name || ''}`.trim().toLowerCase();
      
      switch (sortOption) {
        case 'alphabetical':
          return nameA.localeCompare(nameB);
        case 'utilization': {
          const aTotal = memberTotalsMap.get(a.id) || 0;
          const bTotal = memberTotalsMap.get(b.id) || 0;
          const aCapacity = a.weekly_capacity || workWeekHours;
          const bCapacity = b.weekly_capacity || workWeekHours;
          const aUtil = aCapacity > 0 ? (aTotal / aCapacity) * 100 : 0;
          const bUtil = bCapacity > 0 ? (bTotal / bCapacity) * 100 : 0;
          if (bUtil !== aUtil) return bUtil - aUtil;
          return nameA.localeCompare(nameB);
        }
        case 'location': {
          const locCompare = (a.location || '').localeCompare(b.location || '');
          if (locCompare !== 0) return locCompare;
          return nameA.localeCompare(nameB);
        }
        case 'department': {
          const deptCompare = (a.department || '').localeCompare(b.department || '');
          if (deptCompare !== 0) return deptCompare;
          return nameA.localeCompare(nameB);
        }
        default:
          return nameA.localeCompare(nameB);
      }
    });
  }, [filteredMembers, sortOption, memberTotalsMap, workWeekHours]);

  // Simplified loading state - only block UI while team members are loading
  const isLoading = useMemo(() => {
    // Only treat initial member loading as blocking; other data loads in background
    return loadingMembers;
  }, [loadingMembers]);

  // Separate flag for allocation loading - used for grid/carousel skeleton states
  const isAllocationsLoading = shouldFetchData && isLoadingAllocations;

  const error = membersError || null;

  // Unsorted members for avatar row (alphabetical order by default)
  const unsortedMembers = useMemo(() => {
    if (!filteredMembers || filteredMembers.length === 0) return [];
    
    return [...filteredMembers].sort((a, b) => {
      const nameA = `${a.first_name || ''} ${a.last_name || ''}`.trim().toLowerCase();
      const nameB = `${b.first_name || ''} ${b.last_name || ''}`.trim().toLowerCase();
      return nameA.localeCompare(nameB);
    });
  }, [filteredMembers]);

  // Return stable object with all computed values
  const result = useMemo(() => ({
    allMembers: members || [],
    unsortedMembers: unsortedMembers || [], // Always alphabetical for avatar row
    projects: projects || [],
    allocations: detailedAllocations ? Object.values(detailedAllocations).flatMap(m => m.daily_allocations) : [],
    isLoading,
    isAllocationsLoading,
    error,
    allocationMap,
    getMemberTotal,
    getMemberTotalForRundown,
    getProjectCount,
    getWeeklyLeave,
    annualLeaveData,
    holidaysData,
    otherLeaveData,
    updateOtherLeave
  }), [
    members,
    unsortedMembers,
    projects,
    detailedAllocations,
    isLoading,
    isAllocationsLoading,
    error,
    allocationMap,
    getMemberTotal,
    getMemberTotalForRundown,
    getProjectCount,
    getWeeklyLeave,
    annualLeaveData,
    holidaysData,
    otherLeaveData,
    updateOtherLeave
  ]);

  return result;
};
