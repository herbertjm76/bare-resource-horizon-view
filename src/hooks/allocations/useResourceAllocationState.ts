
import { useState, useCallback } from 'react';
import { MemberAllocation } from '@/components/weekly-overview/types';
import { toast } from 'sonner';

/**
 * Hook for managing member allocation state
 */
export function useResourceAllocationState() {
  // Member allocations state
  const [memberAllocations, setMemberAllocations] = useState<Record<string, MemberAllocation>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Initialize or get member allocation
  const getMemberAllocation = (memberId: string): MemberAllocation => {
    if (!memberAllocations[memberId]) {
      // Use default values if allocation not found
      return {
        id: memberId,
        annualLeave: 0,
        publicHoliday: 0,
        vacationLeave: 0,
        medicalLeave: 0,
        others: 0,
        remarks: '',
        projects: [],
        projectAllocations: [],
        resourcedHours: 0,
      };
    }
    return memberAllocations[memberId];
  };

  // Handle input changes for editable fields
  const handleInputChange = (memberId: string, field: keyof MemberAllocation, value: any) => {
    const numValue = field !== 'remarks' && field !== 'projects' && field !== 'projectAllocations' 
      ? parseFloat(value) || 0 
      : value;
    
    // Update local state for immediate UI feedback
    setMemberAllocations(prev => ({
      ...prev,
      [memberId]: {
        ...prev[memberId],
        [field]: numValue,
      }
    }));
    
    // Here we would save changes to the database
    // For now we're just updating the local state
  };
  
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
