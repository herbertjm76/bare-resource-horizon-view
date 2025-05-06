
import { useState, useEffect, useCallback } from 'react';
import { useResourceAllocationState } from '@/hooks/allocations/useResourceAllocationState';
import { useFetchAllocations } from '@/hooks/allocations/useFetchAllocations';

/**
 * Main hook that combines allocation state management and data fetching
 */
export function useResourceAllocations(teamMembers: any[], selectedWeek: Date) {
  // Track if this is the initial load
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  // Get allocation state management functions
  const {
    memberAllocations,
    setMemberAllocations,
    getMemberAllocation,
    handleInputChange,
    isLoading, 
    setIsLoading,
    error,
    setError
  } = useResourceAllocationState();
  
  // Get allocation data fetching function
  const { fetchAllocations } = useFetchAllocations();
  
  // Fetch allocations when team members or selected week changes
  useEffect(() => {
    console.log('useResourceAllocations effect triggered with week:', selectedWeek);
    console.log('Team members count:', teamMembers.length);
    
    const loadData = async () => {
      await fetchAllocations(
        teamMembers,
        selectedWeek,
        setMemberAllocations,
        setIsLoading,
        setError
      );
      
      // Mark that initial load is complete
      setIsInitialLoad(false);
    };
    
    loadData();
  }, [fetchAllocations, teamMembers, selectedWeek]);

  // Function to manually refresh allocations
  const refreshAllocations = useCallback(() => {
    console.log('Manual refresh of allocations triggered');
    fetchAllocations(
      teamMembers,
      selectedWeek,
      setMemberAllocations,
      setIsLoading,
      setError
    );
  }, [fetchAllocations, teamMembers, selectedWeek, setMemberAllocations, setIsLoading, setError]);

  // Calculate totals for each project
  const projectTotals = useCallback(() => {
    const totals: Record<string, number> = {};
    
    Object.values(memberAllocations).forEach(allocation => {
      allocation.projectAllocations.forEach(project => {
        if (!totals[project.projectId]) {
          totals[project.projectId] = 0;
        }
        totals[project.projectId] += project.hours;
      });
    });
    
    return totals;
  }, [memberAllocations]);

  return {
    memberAllocations,
    getMemberAllocation,
    handleInputChange,
    isLoading: isLoading || isInitialLoad,
    error,
    refreshAllocations,
    projectTotals
  };
}
