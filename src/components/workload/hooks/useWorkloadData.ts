
import { useState, useEffect } from 'react';
import { useCompany } from '@/context/CompanyContext';
import { TeamMember } from '@/components/dashboard/types';
import { WorkloadBreakdown } from './types';
import { useProjectAllocations } from './useProjectAllocations';
import { useAnnualLeaveData } from './useAnnualLeaveData';
import { useOfficeHolidays } from './useOfficeHolidays';
import { useWeeklyOtherLeave } from './useWeeklyOtherLeave';
import { initializeWorkloadData, calculateTotals } from './utils/workloadUtils';

export type { WorkloadBreakdown } from './types';

export const useWorkloadData = (selectedMonth: Date, teamMembers: TeamMember[]) => {
  const [workloadData, setWorkloadData] = useState<Record<string, Record<string, WorkloadBreakdown>>>({});
  const [isLoadingWorkload, setIsLoadingWorkload] = useState<boolean>(true);
  const { company } = useCompany();

  useEffect(() => {
    if (!company?.id || teamMembers.length === 0) {
      setIsLoadingWorkload(false);
      return;
    }

    console.log('Initializing comprehensive workload data for:', teamMembers.length, 'members');
    
    // Initialize the workload data structure
    const workload = initializeWorkloadData(selectedMonth, teamMembers);
    setWorkloadData(workload);
    setIsLoadingWorkload(true);
  }, [company?.id, selectedMonth, teamMembers]);

  // Use individual hooks for each data source
  const { isLoading: isLoadingProjects } = useProjectAllocations(selectedMonth, teamMembers, company?.id, workloadData);
  const { isLoading: isLoadingAnnualLeave } = useAnnualLeaveData(selectedMonth, teamMembers, company?.id, workloadData);
  const { isLoading: isLoadingHolidays } = useOfficeHolidays(selectedMonth, teamMembers, company?.id, workloadData);
  const { isLoading: isLoadingOtherLeave } = useWeeklyOtherLeave(selectedMonth, teamMembers, company?.id, workloadData);

  // Update loading state and calculate totals when all data is fetched
  useEffect(() => {
    const allLoaded = !isLoadingProjects && !isLoadingAnnualLeave && !isLoadingHolidays && !isLoadingOtherLeave;
    
    if (allLoaded && Object.keys(workloadData).length > 0) {
      // Calculate totals for each day
      calculateTotals(workloadData);
      
      console.log('Final comprehensive workload data:', workloadData);
      setWorkloadData({ ...workloadData }); // Trigger re-render
      setIsLoadingWorkload(false);
    }
  }, [isLoadingProjects, isLoadingAnnualLeave, isLoadingHolidays, isLoadingOtherLeave, workloadData]);

  return { workloadData, isLoadingWorkload };
};
