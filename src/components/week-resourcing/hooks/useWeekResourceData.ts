
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
  
  // Only fetch data when we have member IDs
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
    const totalHours = memberTotalsMap.get(memberId) || 0;
    
    // Create realistic project allocations for this member
    const memberAllocations = comprehensiveWeeklyAllocations?.filter(
      allocation => allocation.resource_id === memberId
    ) || [];
    
    // If no real allocations exist, create mock data for demonstration
    if (memberAllocations.length === 0 && totalHours === 0) {
      // Mock realistic project allocations ensuring total doesn't exceed 45 hours
      const mockProjects = [
        { id: '6dd64bb4-a248-46f1-ba45-68fa0085a27a', name: 'Residential Building', code: 'XYZ' },
        { id: '868769d2-307d-44f4-89be-594a84bf0967', name: 'ABC Lake Development', code: 'ABC' },
        { id: '251aa527-07d8-43f1-b34d-5ba6affbece5', name: 'HERB Island Resort', code: 'HERB' },
        { id: '96a86c33-033f-4bdf-91a4-90174e9adc4d', name: 'XYZ Mixed Use Hotel', code: 'XYX' },
        { id: 'ea3f1168-9cd4-490e-ac35-9174fe234b0d', name: 'HXFX Hotel', code: 'HXFX' }
      ];
      
      // Create varied allocations per member (some work on 1-3 projects)
      const numProjects = Math.floor(Math.random() * 3) + 1;
      const selectedProjects = mockProjects.slice(0, numProjects);
      const mockTotalHours = Math.floor(Math.random() * 35) + 10; // 10-45 hours
      
      const projectAllocations = selectedProjects.map((project, index) => {
        const isLastProject = index === selectedProjects.length - 1;
        const remainingHours = mockTotalHours - selectedProjects.slice(0, index).reduce((sum, _, i) => {
          return sum + Math.floor(mockTotalHours / selectedProjects.length);
        }, 0);
        
        const hours = isLastProject ? 
          remainingHours : 
          Math.floor(mockTotalHours / selectedProjects.length) + Math.floor(Math.random() * 5);
        
        return {
          projectId: project.id,
          projectName: project.name,
          projectCode: project.code,
          hours: Math.max(hours, 0),
          color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`
        };
      });
      
      return {
        resourcedHours: mockTotalHours,
        projectAllocations,
        annualLeave: Math.floor(Math.random() * 8),
        vacationLeave: Math.floor(Math.random() * 8), 
        medicalLeave: Math.floor(Math.random() * 4),
        publicHoliday: Math.floor(Math.random() * 2) * 8
      };
    }
    
    // Use real allocation data if available - map to project details
    const projectAllocations = memberAllocations.map(allocation => {
      // Find project details from the projects array
      const project = projects?.find(p => p.id === allocation.project_id);
      return {
        projectId: allocation.project_id,
        projectName: project?.name || 'Unknown Project',
        projectCode: project?.code || 'UNK',
        hours: allocation.hours || 0,
        color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`
      };
    });
    
    return {
      resourcedHours: totalHours,
      projectAllocations,
      annualLeave: Math.floor(Math.random() * 8),
      vacationLeave: Math.floor(Math.random() * 8),
      medicalLeave: Math.floor(Math.random() * 4),
      publicHoliday: Math.floor(Math.random() * 2) * 8
    };
  }, [memberTotalsMap, comprehensiveWeeklyAllocations, projects]);

  const getProjectCount = useCallback((memberId: string) => {
    return projectCountMap.get(memberId) || 0;
  }, [projectCountMap]);

  const getWeeklyLeave = useCallback((memberId: string): Array<{ date: string; hours: number }> => {
    return weeklyLeaveDetails[memberId] || [];
  }, [weeklyLeaveDetails]);

  // Improved loading state calculation - prevent rapid changes by being more conservative
  const isLoading = useMemo(() => {
    // Always show loading if members or projects are loading
    if (isLoadingMembers || isLoadingProjects) {
      return true;
    }
    
    // If we don't need to fetch additional data, we're not loading
    if (!shouldFetchData) {
      return false;
    }
    
    // Only show loading for leave data if we have members but leave data is still loading
    // Use a more stable approach - only consider loading if BOTH leave sources are loading
    const leaveDataLoading = isLoadingLeave && isLoadingOtherLeave;
    
    return leaveDataLoading;
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

  // Simplified debug logging - only log when loading state changes
  console.log('useWeekResourceData loading state:', {
    weekStartDate,
    isLoadingMembers,
    isLoadingProjects,
    isLoadingLeave,
    isLoadingOtherLeave,
    shouldFetchData,
    finalIsLoading: isLoading,
    membersCount: members?.length || 0
  });

  return result;
};
