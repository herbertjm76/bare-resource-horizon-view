
import { useState, useCallback } from 'react';
import { MemberAllocation } from '@/components/weekly-overview/types';

/**
 * Hook to manage the state of resource allocations
 */
export function useResourceAllocationState() {
  // State for storing member allocations
  const [memberAllocations, setMemberAllocations] = useState<Record<string, MemberAllocation>>({});
  
  // State for tracking loading and error states
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Function to get allocation for a specific member
  const getMemberAllocation = useCallback((memberId: string) => {
    return memberAllocations[memberId] || {
      id: memberId,
      annualLeave: 0,
      publicHoliday: 0,
      vacationLeave: 0,
      medicalLeave: 0,
      others: 0,
      remarks: '',
      projects: [],
      projectAllocations: [],
      resourcedHours: 0
    };
  }, [memberAllocations]);
  
  // Function to handle input changes (e.g., hours, remarks)
  const handleInputChange = useCallback((memberId: string, field: string, value: any) => {
    console.log(`Updating ${field} for member ${memberId} to:`, value);
    
    setMemberAllocations(prev => {
      const allocation = prev[memberId] || {
        id: memberId,
        annualLeave: 0,
        publicHoliday: 0,
        vacationLeave: 0,
        medicalLeave: 0,
        others: 0,
        remarks: '',
        projects: [],
        projectAllocations: [],
        resourcedHours: 0
      };
      
      return {
        ...prev,
        [memberId]: {
          ...allocation,
          [field]: value
        }
      };
    });
  }, []);
  
  return {
    memberAllocations,
    setMemberAllocations,
    getMemberAllocation,
    handleInputChange,
    isLoading, 
    setIsLoading,
    error,
    setError
  };
}
