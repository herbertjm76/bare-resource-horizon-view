
import { useMemo } from 'react';
import { useWeekResourceTeamMembers } from './useWeekResourceTeamMembers';
import { useWeekResourceProjects } from './useWeekResourceProjects';
import { useComprehensiveAllocations } from './useComprehensiveAllocations';
import { useWeekResourceLeaveData } from './useWeekResourceLeaveData';

export const useWeekResourceData = (weekStartDate: string, filters: any) => {
  // Fetch team members
  const { members, isLoading: isLoadingMembers } = useWeekResourceTeamMembers(filters);
  
  // Fetch projects
  const { projects, isLoading: isLoadingProjects } = useWeekResourceProjects();
  
  // Fetch allocations
  const { allocations, isLoading: isLoadingAllocations } = useComprehensiveAllocations(weekStartDate);
  
  // Fetch leave data
  const { 
    annualLeaveData, 
    holidaysData, 
    getWeeklyLeave,
    isLoading: isLoadingLeave 
  } = useWeekResourceLeaveData(weekStartDate);

  // Create allocation map
  const allocationMap = useMemo(() => {
    const map = new Map<string, number>();
    allocations.forEach(allocation => {
      const key = `${allocation.resource_id}:${allocation.project_id}`;
      map.set(key, allocation.hours || 0);
    });
    return map;
  }, [allocations]);

  // Calculate member totals
  const getMemberTotal = useMemo(() => {
    return (memberId: string) => {
      let total = 0;
      allocations.forEach(allocation => {
        if (allocation.resource_id === memberId) {
          total += allocation.hours || 0;
        }
      });
      return total;
    };
  }, [allocations]);

  // Calculate project count per member - fixed logic
  const getProjectCount = useMemo(() => {
    return (memberId: string) => {
      const uniqueProjects = new Set<string>();
      allocations.forEach(allocation => {
        if (allocation.resource_id === memberId && (allocation.hours || 0) > 0) {
          uniqueProjects.add(allocation.project_id);
        }
      });
      console.log(`Project count for member ${memberId}:`, uniqueProjects.size, 'projects:', Array.from(uniqueProjects));
      return uniqueProjects.size;
    };
  }, [allocations]);

  const isLoading = isLoadingMembers || isLoadingProjects || isLoadingAllocations || isLoadingLeave;

  return {
    members,
    projects,
    allocations,
    isLoading,
    allocationMap,
    getMemberTotal,
    getProjectCount,
    getWeeklyLeave,
    annualLeaveData,
    holidaysData
  };
};
