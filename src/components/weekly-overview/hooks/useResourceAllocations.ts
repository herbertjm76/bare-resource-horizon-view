
import { useState, useEffect, useCallback } from 'react';
import { useResourceAllocationState } from '@/hooks/allocations/useResourceAllocationState';
import { useFetchAllocations } from '@/hooks/allocations/useFetchAllocations';
import { toast } from 'sonner';
import { logger } from '@/utils/logger';

/**
 * Main hook that combines allocation state management and data fetching
 * OPTIMIZED: Removed artificial delays to ensure instant UI updates
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
    isLoading: allocationsStateLoading, 
    setIsLoading: setAllocationsStateLoading,
    error,
    setError
  } = useResourceAllocationState();
  
  // Get allocation data fetching function
  const { fetchAllocations } = useFetchAllocations();
  
  // Fetch allocations when team members or selected week changes
  useEffect(() => {
    logger.log('useResourceAllocations effect triggered with week:', selectedWeek);
    logger.log('Team members count:', teamMembers.length);
    
    if (teamMembers.length === 0) {
      setAllocationsStateLoading(false);
      setIsInitialLoad(false);
      return;
    }
    
    // Set loading state
    setAllocationsStateLoading(true);
    
    const loadData = async () => {
      try {
        await fetchAllocations(
          teamMembers,
          selectedWeek,
          setMemberAllocations,
          setAllocationsStateLoading,
          setError
        );
        
        // Mark that initial load is complete immediately
        setIsInitialLoad(false);
      } catch (err) {
        logger.error('Failed to load allocations:', err);
        const error = err instanceof Error ? err : new Error('Failed to load allocations');
        setError(error);
        setAllocationsStateLoading(false);
        setIsInitialLoad(false);
        toast.error('Failed to load allocations');
      }
    };
    
    loadData();
  }, [fetchAllocations, teamMembers, selectedWeek, setMemberAllocations, setAllocationsStateLoading, setError]);

  // Function to manually refresh allocations
  const refreshAllocations = useCallback(() => {
    logger.log('Manual refresh of allocations triggered');
    setAllocationsStateLoading(true);
    
    fetchAllocations(
      teamMembers,
      selectedWeek,
      setMemberAllocations,
      setAllocationsStateLoading,
      setError
    );
  }, [fetchAllocations, teamMembers, selectedWeek, setMemberAllocations, setAllocationsStateLoading, setError]);

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
    isLoading: allocationsStateLoading || isInitialLoad,
    error,
    refreshAllocations,
    projectTotals
  };
}
