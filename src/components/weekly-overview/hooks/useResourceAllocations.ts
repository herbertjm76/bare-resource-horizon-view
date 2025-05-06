
import { useState, useEffect, useCallback } from 'react';
import { useResourceAllocationState } from '@/hooks/allocations/useResourceAllocationState';
import { useFetchAllocations } from '@/hooks/allocations/useFetchAllocations';

/**
 * Main hook that combines allocation state management and data fetching
 */
export function useResourceAllocations(teamMembers: any[], selectedWeek: Date) {
  // Track if this is the initial load
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  // Track if loading is stuck
  const [loadingStuckTimer, setLoadingStuckTimer] = useState<NodeJS.Timeout | null>(null);
  
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
  
  // Function to ensure loading state eventually gets cleared
  const ensureLoadingEnds = useCallback(() => {
    // Clear any existing timer
    if (loadingStuckTimer) {
      clearTimeout(loadingStuckTimer);
    }
    
    // Set a new timer that will force loading state to false after 10 seconds
    const timer = setTimeout(() => {
      console.log('Loading state was potentially stuck, forcing it to false');
      setIsLoading(false);
      setIsInitialLoad(false);
    }, 10000); // 10 second safety timeout
    
    setLoadingStuckTimer(timer);
  }, [loadingStuckTimer, setIsLoading]);
  
  // Fetch allocations when team members or selected week changes
  useEffect(() => {
    console.log('useResourceAllocations effect triggered with week:', selectedWeek);
    console.log('Team members count:', teamMembers.length);
    
    // Set loading state and start safety timer
    setIsLoading(true);
    ensureLoadingEnds();
    
    const loadData = async () => {
      try {
        await fetchAllocations(
          teamMembers,
          selectedWeek,
          setMemberAllocations,
          setIsLoading,
          setError
        );
        
        // Mark that initial load is complete
        setIsInitialLoad(false);
        
        // Clear safety timer since load completed normally
        if (loadingStuckTimer) {
          clearTimeout(loadingStuckTimer);
        }
      } catch (err) {
        console.error('Failed to load allocations:', err);
        setError('Failed to load allocations');
        setIsLoading(false);
        setIsInitialLoad(false);
      }
    };
    
    loadData();
    
    // Clean up timer on unmount
    return () => {
      if (loadingStuckTimer) {
        clearTimeout(loadingStuckTimer);
      }
    };
  }, [fetchAllocations, teamMembers, selectedWeek, ensureLoadingEnds]);

  // Function to manually refresh allocations
  const refreshAllocations = useCallback(() => {
    console.log('Manual refresh of allocations triggered');
    setIsLoading(true);
    ensureLoadingEnds();
    
    fetchAllocations(
      teamMembers,
      selectedWeek,
      setMemberAllocations,
      setIsLoading,
      setError
    );
  }, [fetchAllocations, teamMembers, selectedWeek, setMemberAllocations, setIsLoading, setError, ensureLoadingEnds]);

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
