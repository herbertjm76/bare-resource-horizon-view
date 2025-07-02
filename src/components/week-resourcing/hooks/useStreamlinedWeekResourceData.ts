
import { useMemo, useCallback } from 'react';
import { useWeekResourceTeamMembers } from './useWeekResourceTeamMembers';
import { useWeekResourceProjects } from './useWeekResourceProjects';
import { useDetailedWeeklyAllocations } from './useDetailedWeeklyAllocations';
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
  
  // Fetch allocations - FIXED: Use detailed allocations that fetch all 7 days of the week
  const { data: detailedAllocations } = useDetailedWeeklyAllocations(
    selectedWeek, 
    shouldFetchData ? memberIds : []
  );
  
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

  // Create stable allocation map - Use detailed allocations that have proper daily breakdowns
  const allocationMap = useMemo(() => {
    const map = new Map<string, number>();
    
    if (detailedAllocations) {
      console.log('DEBUG useStreamlinedWeekResourceData - Building allocation map from detailed allocations');
      console.log('DEBUG detailed allocations keys:', Object.keys(detailedAllocations));
      
      Object.values(detailedAllocations).forEach(memberData => {
        memberData.projects.forEach(project => {
          const key = `${memberData.member_id}:${project.project_id}`;
          const totalHours = project.total_hours;
          map.set(key, totalHours);
          
          console.log(`DEBUG Allocation map - Key: ${key}, Hours: ${totalHours}h`);
        });
      });
      
      console.log('DEBUG Final allocation map:', Array.from(map.entries()));
    }
    
    return map;
  }, [detailedAllocations]);

  // Create stable member totals map - Use detailed allocations for accurate totals
  const memberTotalsMap = useMemo(() => {
    const totalsMap = new Map<string, number>();
    
    if (detailedAllocations) {
      Object.values(detailedAllocations).forEach(memberData => {
        totalsMap.set(memberData.member_id, memberData.total_hours);
        console.log(`DEBUG Member totals - ${memberData.member_id}: ${memberData.total_hours}h`);
      });
      
      console.log('Final member totals map:', Array.from(totalsMap.entries()));
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
    const total = memberTotalsMap.get(memberId) || 0;
    console.log(`getMemberTotal for ${memberId}:`, total);
    return total;
  }, [memberTotalsMap]);

  const getProjectCount = useCallback((memberId: string) => {
    const count = projectCountMap.get(memberId) || 0;
    console.log(`getProjectCount for ${memberId}:`, count);
    return count;
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
    allocations: detailedAllocations ? Object.values(detailedAllocations).flatMap(m => m.daily_allocations) : [],
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
    detailedAllocations,
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

  // Enhanced logging for debugging
  console.log('Streamlined WeekResourceData:', {
    weekStartDate,
    membersCount: members?.length || 0,
    projectsCount: projects?.length || 0,
    detailedAllocationsCount: detailedAllocations ? Object.keys(detailedAllocations).length : 0,
    allocationMapSize: allocationMap.size,
    memberTotalsMapSize: memberTotalsMap.size,
    isLoading,
    shouldFetchData,
    // Log sample allocation map entries for debugging
    sampleAllocationEntries: Array.from(allocationMap.entries()).slice(0, 5),
    // Log member totals for debugging
    sampleMemberTotals: Array.from(memberTotalsMap.entries()).slice(0, 3)
  });

  return result;
};
