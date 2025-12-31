
import { useState, useEffect, useCallback } from 'react';
import { useResourceAllocationState } from '@/hooks/allocations/useResourceAllocationState';
import { useFetchAllocations } from '@/hooks/allocations/useFetchAllocations';
import { toast } from 'sonner';
import { logger } from '@/utils/logger';

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
    isLoading: allocationsStateLoading, 
    setIsLoading: setAllocationsStateLoading,
    error,
    setError
  } = useResourceAllocationState();
  
  // Local loading state to prevent rapid changes
  const [isLoading, setIsLoading] = useState(true);
  
  // Get allocation data fetching function
  const { fetchAllocations } = useFetchAllocations();
  
  // Update isLoading based on allocationsStateLoading with a slight delay to prevent flickering
  useEffect(() => {
    // If allocationsStateLoading is false, add a slight delay before updating isLoading
    if (!allocationsStateLoading && isLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    } else if (allocationsStateLoading && !isLoading) {
      // If allocationsStateLoading is true, update isLoading immediately
      setIsLoading(true);
    }
  }, [allocationsStateLoading, isLoading]);
  
  // Fetch allocations when team members or selected week changes
  useEffect(() => {
    logger.log('useResourceAllocations effect triggered with week:', selectedWeek);
    logger.log('Team members count:', teamMembers.length);
    
    if (teamMembers.length === 0) {
      setIsLoading(false);
      setAllocationsStateLoading(false);
      setIsInitialLoad(false);
      return;
    }
    
    // Set loading state
    setIsLoading(true);
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
        
        // Mark that initial load is complete
        setIsInitialLoad(false);
      } catch (err) {
        logger.error('Failed to load allocations:', err);
        const error = err instanceof Error ? err : new Error('Failed to load allocations');
        setError(error);
        setAllocationsStateLoading(false);
        setIsLoading(false);
        setIsInitialLoad(false);
        toast.error('Failed to load allocations');
      }
    };
    
    loadData();
  }, [fetchAllocations, teamMembers, selectedWeek, setMemberAllocations, setAllocationsStateLoading, setError]);

  // Function to manually refresh allocations
  const refreshAllocations = useCallback(() => {
    logger.log('Manual refresh of allocations triggered');
    setIsLoading(true);
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
    isLoading: isLoading || isInitialLoad,
    error,
    refreshAllocations,
    projectTotals
  };
}
