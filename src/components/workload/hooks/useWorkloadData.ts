
import { useState, useEffect, useMemo } from 'react';
import { useCompany } from '@/context/CompanyContext';
import { TeamMember } from '@/components/dashboard/types';
import { WorkloadBreakdown, MemberWorkloadData } from './types';
import { useProjectAllocations } from './useProjectAllocations';
import { useAnnualLeaveData } from './useAnnualLeaveData';
import { useOfficeHolidays } from './useOfficeHolidays';
import { useWeeklyOtherLeave } from './useWeeklyOtherLeave';
import { initializeWorkloadData, calculateTotals } from './utils/workloadUtils';

export type { WorkloadBreakdown } from './types';

export const useWorkloadData = (selectedMonth: Date, teamMembers: TeamMember[]) => {
  const [workloadData, setWorkloadData] = useState<Record<string, MemberWorkloadData>>({});
  const [isLoadingWorkload, setIsLoadingWorkload] = useState<boolean>(true);
  const { company } = useCompany();

  // Create a stable workload data structure that doesn't change on every render
  const initialWorkloadData = useMemo(() => {
    if (!company?.id || teamMembers.length === 0) return {};
    return initializeWorkloadData(selectedMonth, teamMembers);
  }, [company?.id, selectedMonth, teamMembers]);

  // Initialize workload data when dependencies change
  useEffect(() => {
    if (!company?.id || teamMembers.length === 0) {
      setIsLoadingWorkload(false);
      setWorkloadData({});
      return;
    }

    console.log('Initializing comprehensive workload data for:', teamMembers.length, 'members');
    
    // Convert the flat structure to MemberWorkloadData structure
    const convertedData: Record<string, MemberWorkloadData> = {};
    Object.keys(initialWorkloadData).forEach(memberId => {
      convertedData[memberId] = {
        daily: initialWorkloadData[memberId]
      };
    });
    
    setWorkloadData(convertedData);
    setIsLoadingWorkload(true);
  }, [company?.id, selectedMonth, teamMembers, initialWorkloadData]);

  // Use individual hooks for each data source - pass callback functions instead of mutable objects
  const { data: projectData, isLoading: isLoadingProjects } = useProjectAllocations(selectedMonth, teamMembers, company?.id);
  const { data: annualLeaveData, isLoading: isLoadingAnnualLeave } = useAnnualLeaveData(selectedMonth, teamMembers, company?.id);
  const { data: holidaysData, isLoading: isLoadingHolidays } = useOfficeHolidays(selectedMonth, teamMembers, company?.id);
  const { data: otherLeaveData, isLoading: isLoadingOtherLeave } = useWeeklyOtherLeave(selectedMonth, teamMembers, company?.id);

  // Combine all data when everything is loaded
  useEffect(() => {
    const allLoaded = !isLoadingProjects && !isLoadingAnnualLeave && !isLoadingHolidays && !isLoadingOtherLeave;
    
    if (allLoaded && Object.keys(initialWorkloadData).length > 0) {
      console.log('Combining all workload data sources...');
      
      // Start with a fresh copy of the initial data
      const combinedData = JSON.parse(JSON.stringify(initialWorkloadData));
      
      // Add project hours
      if (projectData) {
        Object.keys(projectData).forEach(memberId => {
          Object.keys(projectData[memberId]).forEach(dateKey => {
            if (combinedData[memberId] && combinedData[memberId][dateKey]) {
              combinedData[memberId][dateKey].projectHours = projectData[memberId][dateKey];
            }
          });
        });
      }
      
      // Add annual leave
      if (annualLeaveData) {
        Object.keys(annualLeaveData).forEach(memberId => {
          Object.keys(annualLeaveData[memberId]).forEach(dateKey => {
            if (combinedData[memberId] && combinedData[memberId][dateKey]) {
              combinedData[memberId][dateKey].annualLeave = annualLeaveData[memberId][dateKey];
            }
          });
        });
      }
      
      // Add office holidays
      if (holidaysData) {
        Object.keys(holidaysData).forEach(memberId => {
          Object.keys(holidaysData[memberId]).forEach(dateKey => {
            if (combinedData[memberId] && combinedData[memberId][dateKey]) {
              combinedData[memberId][dateKey].officeHolidays = holidaysData[memberId][dateKey];
            }
          });
        });
      }
      
      // Add other leave
      if (otherLeaveData) {
        Object.keys(otherLeaveData).forEach(memberId => {
          Object.keys(otherLeaveData[memberId]).forEach(dateKey => {
            if (combinedData[memberId] && combinedData[memberId][dateKey]) {
              combinedData[memberId][dateKey].otherLeave = otherLeaveData[memberId][dateKey];
            }
          });
        });
      }
      
      // Calculate totals for each day
      calculateTotals(combinedData);
      
      // Convert the flat structure to MemberWorkloadData structure
      const finalWorkloadData: Record<string, MemberWorkloadData> = {};
      Object.keys(combinedData).forEach(memberId => {
        finalWorkloadData[memberId] = {
          daily: combinedData[memberId]
        };
      });
      
      console.log('Final comprehensive workload data:', finalWorkloadData);
      setWorkloadData(finalWorkloadData);
      setIsLoadingWorkload(false);
    }
  }, [isLoadingProjects, isLoadingAnnualLeave, isLoadingHolidays, isLoadingOtherLeave, projectData, annualLeaveData, holidaysData, otherLeaveData, initialWorkloadData]);

  return { workloadData, isLoadingWorkload };
};
