
import { useMemo } from 'react';
import { useWeekResourceTeamMembers } from './useWeekResourceTeamMembers';
import { useWeekResourceProjects } from './useWeekResourceProjects';
import { useComprehensiveAllocations } from './useComprehensiveAllocations';
import { useWeekResourceLeaveData } from './useWeekResourceLeaveData';

export const useWeekResourceData = (weekStartDate: string, filters: any) => {
  // Fetch team members
  const { members, loadingMembers: isLoadingMembers, membersError } = useWeekResourceTeamMembers();
  
  // Fetch projects
  const { data: projects = [], isLoading: isLoadingProjects } = useWeekResourceProjects({ filters });
  
  // Extract member IDs for allocations and leave data
  const memberIds = useMemo(() => members.map(member => member.id), [members]);
  
  // Fetch allocations
  const { comprehensiveWeeklyAllocations = [] } = useComprehensiveAllocations({ 
    weekStartDate, 
    memberIds 
  });
  
  // Fetch leave data
  const { 
    annualLeaveData, 
    holidaysData, 
    isLoading: isLoadingLeave 
  } = useWeekResourceLeaveData({ 
    weekStartDate, 
    memberIds 
  });

  // Create allocation map
  const allocationMap = useMemo(() => {
    const map = new Map<string, number>();
    comprehensiveWeeklyAllocations.forEach(allocation => {
      const key = `${allocation.resource_id}:${allocation.project_id}`;
      map.set(key, allocation.hours || 0);
    });
    return map;
  }, [comprehensiveWeeklyAllocations]);

  // Calculate member totals
  const getMemberTotal = useMemo(() => {
    return (memberId: string) => {
      let total = 0;
      comprehensiveWeeklyAllocations.forEach(allocation => {
        if (allocation.resource_id === memberId) {
          total += allocation.hours || 0;
        }
      });
      return total;
    };
  }, [comprehensiveWeeklyAllocations]);

  // Calculate project count per member - fixed logic
  const getProjectCount = useMemo(() => {
    return (memberId: string) => {
      const uniqueProjects = new Set<string>();
      comprehensiveWeeklyAllocations.forEach(allocation => {
        if (allocation.resource_id === memberId && (allocation.hours || 0) > 0) {
          uniqueProjects.add(allocation.project_id);
        }
      });
      console.log(`Project count for member ${memberId}:`, uniqueProjects.size, 'projects:', Array.from(uniqueProjects));
      return uniqueProjects.size;
    };
  }, [comprehensiveWeeklyAllocations]);

  // Create a simple getWeeklyLeave function that returns empty array for now
  const getWeeklyLeave = useMemo(() => {
    return (memberId: string) => {
      // This could be enhanced to return actual weekly leave breakdown
      return [];
    };
  }, []);

  const isLoading = isLoadingMembers || isLoadingProjects || isLoadingLeave;
  const error = membersError || null;

  return {
    members,
    projects,
    allocations: comprehensiveWeeklyAllocations,
    isLoading,
    error,
    allocationMap,
    getMemberTotal,
    getProjectCount,
    getWeeklyLeave,
    annualLeaveData: annualLeaveData || {},
    holidaysData: holidaysData || {}
  };
};
