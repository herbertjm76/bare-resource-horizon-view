
import { useState, useEffect, useCallback } from 'react';
import { useResourceAllocationState } from '@/hooks/allocations/useResourceAllocationState';
import { useFetchAllocations } from '@/hooks/allocations/useFetchAllocations';
import { MemberAllocation } from '../types';

interface TeamMember {
  id: string;
  first_name: string;
  last_name: string;
  location: string | null;
  weekly_capacity?: number;
}

/**
 * Main hook that combines allocation state management and data fetching
 */
export function useResourceAllocations(teamMembers: TeamMember[], selectedWeek: Date) {
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
    
    fetchAllocations(
      teamMembers,
      selectedWeek,
      setMemberAllocations,
      setIsLoading,
      setError
    );
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
  }, [fetchAllocations, teamMembers, selectedWeek]);

  return {
    memberAllocations,
    getMemberAllocation,
    handleInputChange,
    isLoading,
    error,
    refreshAllocations
  };
}
