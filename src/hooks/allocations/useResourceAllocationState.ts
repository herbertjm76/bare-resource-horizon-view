
import { useState, useCallback, useEffect } from 'react';
import { MemberAllocation } from '@/components/weekly-overview/types';
import { toast } from 'sonner';
import { logger } from '@/utils/logger';

/**
 * Hook to manage the state of resource allocations
 */
export function useResourceAllocationState() {
  // State for storing member allocations
  const [memberAllocations, setMemberAllocations] = useState<Record<string, MemberAllocation>>({});
  
  // State for tracking loading and error states
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | Error | null>(null);
  
  // Force loading state to clear after a maximum time to prevent getting stuck
  useEffect(() => {
    // If loading takes more than 8 seconds, force it to complete
    const safetyTimer = setTimeout(() => {
      if (isLoading) {
        logger.log('Allocation state loading safety timeout reached, forcing completion');
        toast.info("Some data may still be loading", { duration: 3000 });
        setIsLoading(false);
      }
    }, 8000);
    
    return () => clearTimeout(safetyTimer);
  }, [isLoading]);
  
  // Function to get allocation for a specific member
  const getMemberAllocation = useCallback((memberId: string): MemberAllocation => {
    return memberAllocations[memberId] || {
      // Original properties
      projectCount: 0,
      projectHours: 0,
      vacationHours: 0,
      generalOfficeHours: 0,
      marketingHours: 0,
      publicHolidayHours: 0,
      medicalLeaveHours: 0,
      annualLeaveHours: 0,
      otherLeaveHours: 0,
      remarks: '',
      
      // Enhanced properties
      id: memberId,
      annualLeave: 0,
      publicHoliday: 0,
      vacationLeave: 0,
      medicalLeave: 0,
      others: 0,
      projects: [],
      projectAllocations: [],
      resourcedHours: 0
    };
  }, [memberAllocations]);
  
  // Function to handle input changes (e.g., hours, remarks)
  const handleInputChange = useCallback((memberId: string, field: string, value: any) => {
    logger.log(`Updating ${field} for member ${memberId} to:`, value);
    
    setMemberAllocations(prev => {
      const allocation = getMemberAllocation(memberId);
      
      return {
        ...prev,
        [memberId]: {
          ...allocation,
          [field]: value
        }
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
