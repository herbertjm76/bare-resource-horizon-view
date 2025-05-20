
import { useState, useCallback } from 'react';
import { MemberAllocation } from '../types';

export function useResourceAllocationState() {
  const [memberAllocations, setMemberAllocations] = useState<Record<string, MemberAllocation>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | Error | null>(null);
  
  // Get allocation for a member, with defaults if not found
  const getMemberAllocation = useCallback((memberId: string): MemberAllocation => {
    return memberAllocations[memberId] || {
      id: memberId,
      annualLeave: 0,
      publicHoliday: 0,
      vacationLeave: 0,
      medicalLeave: 0,
      others: 0,
      remarks: '',
      projects: [],
      resourcedHours: 0,
      projectAllocations: []
    };
  }, [memberAllocations]);
  
  // Handle input changes from the UI
  const handleInputChange = useCallback((memberId: string, field: keyof MemberAllocation, value: any) => {
    setMemberAllocations(prev => {
      const memberAllocation = getMemberAllocation(memberId);
      
      // Handle numeric conversions
      let newValue = value;
      if (['annualLeave', 'publicHoliday', 'vacationLeave', 'medicalLeave', 'others'].includes(field)) {
        newValue = isNaN(parseFloat(value)) ? 0 : parseFloat(value);
      }
      
      // Create updated allocation
      const updatedAllocation = {
        ...memberAllocation,
        [field]: newValue
      };
      
      return {
        ...prev,
        [memberId]: updatedAllocation
      };
    });
  }, [getMemberAllocation]);
  
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
