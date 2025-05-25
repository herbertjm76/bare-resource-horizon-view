
import { useState, useEffect, useMemo } from 'react';
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

  // Create a stable workload data structure that doesn't change on every render
  const initialWorkloadData = useMemo(() => {
    if (!company?.id || teamMembers.length === 0) return {};
    return initializeWorkloadData(selectedMonth, teamMembers);
  }, [company?.id, selectedMonth, teamMembers]);

  useEffect(() => {
    if (!company?.id || teamMembers.length === 0) {
      setIsLoadingWorkload(false);
      setWorkloadData({});
      return;
    }

    console.log('Initializing comprehensive workload data for:', teamMembers.length, 'members');
    setWorkloadData({ ...initialWorkloadData });
    setIsLoadingWorkload(true);
  }, [company?.id, selectedMonth, teamMembers, initialWorkloadData]);

  // Use individual hooks for each data source
  const { isLoading: isLoadingProjects } = useProjectAllocations(selectedMonth, teamMembers, company?.id, workloadData);
  const { isLoading: isLoadingAnnualLeave } = useAnnualLeaveData(selectedMonth, teamMembers, company?.id, workloadData);
  const { isLoading: isLoadingHolidays } = useOfficeHolidays(selectedMonth, teamMembers, company?.id, workloadData);
  const { isLoading: isLoadingOtherLeave } = useWeeklyOtherLeave(selectedMonth, teamMembers, company?.id, workloadData);

  // Update loading state and calculate totals when all data is fetched
  useEffect(() => {
    const allLoaded = !isLoadingProjects && !isLoadingAnnualLeave && !isLoadingHolidays && !isLoadingOtherLeave;
    
    if (allLoaded && Object.keys(workloadData).length > 0) {
      // Create a new copy of the workload data to avoid mutations
      const updatedWorkloadData = JSON.parse(JSON.stringify(workloadData));
      
      // Calculate totals for each day
      calculateTotals(updatedWorkloadData);
      
      console.log('Final comprehensive workload data:', updatedWorkloadData);
      setWorkloadData(updatedWorkloadData);
      setIsLoadingWorkload(false);
    }
  }, [isLoadingProjects, isLoadingAnnualLeave, isLoadingHolidays, isLoadingOtherLeave, workloadData]);

  return { workloadData, isLoadingWorkload };
};
