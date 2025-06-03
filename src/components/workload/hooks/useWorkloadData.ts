
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

export const useWorkloadData = (selectedDate: Date, teamMembers: TeamMember[], periodWeeks: number = 1) => {
  const [workloadData, setWorkloadData] = useState<Record<string, MemberWorkloadData>>({});
  const [isLoadingWorkload, setIsLoadingWorkload] = useState<boolean>(true);
  const { company } = useCompany();

  // Create a stable workload data structure that doesn't change on every render
  const initialWorkloadData = useMemo(() => {
    if (!company?.id || teamMembers.length === 0) return {};
    return initializeWorkloadData(selectedDate, teamMembers, periodWeeks);
  }, [company?.id, selectedDate, teamMembers, periodWeeks]);

  // Initialize workload data when dependencies change
  useEffect(() => {
    if (!company?.id || teamMembers.length === 0) {
      setIsLoadingWorkload(false);
      setWorkloadData({});
      return;
    }

    console.log('🔍 WORKLOAD INVESTIGATION: Initializing comprehensive workload data for:', teamMembers.length, 'members', 'for', periodWeeks, 'weeks');
    console.log('🔍 WORKLOAD INVESTIGATION: Selected date:', selectedDate);
    console.log('🔍 WORKLOAD INVESTIGATION: Period weeks:', periodWeeks);
    
    // Convert the flat structure to MemberWorkloadData structure
    const convertedData: Record<string, MemberWorkloadData> = {};
    Object.keys(initialWorkloadData).forEach(memberId => {
      convertedData[memberId] = {
        daily: initialWorkloadData[memberId]
      };
    });
    
    setWorkloadData(convertedData);
    setIsLoadingWorkload(true);
  }, [company?.id, selectedDate, teamMembers, periodWeeks, initialWorkloadData]);

  // Use individual hooks for each data source - pass callback functions instead of mutable objects
  const { data: projectData, isLoading: isLoadingProjects } = useProjectAllocations(selectedDate, teamMembers, company?.id);
  const { data: annualLeaveData, isLoading: isLoadingAnnualLeave } = useAnnualLeaveData(selectedDate, teamMembers, company?.id);
  const { data: holidaysData, isLoading: isLoadingHolidays } = useOfficeHolidays(selectedDate, teamMembers, company?.id);
  const { data: otherLeaveData, isLoading: isLoadingOtherLeave } = useWeeklyOtherLeave(selectedDate, teamMembers, company?.id);

  // Combine all data when everything is loaded
  useEffect(() => {
    const allLoaded = !isLoadingProjects && !isLoadingAnnualLeave && !isLoadingHolidays && !isLoadingOtherLeave;
    
    if (allLoaded && Object.keys(initialWorkloadData).length > 0) {
      console.log('🔍 WORKLOAD INVESTIGATION: Combining all workload data sources...');
      
      // Start with a fresh copy of the initial data
      const combinedData = JSON.parse(JSON.stringify(initialWorkloadData));
      
      // Add project hours
      if (projectData) {
        console.log('🔍 WORKLOAD INVESTIGATION: Project data received:', projectData);
        Object.keys(projectData).forEach(memberId => {
          Object.keys(projectData[memberId]).forEach(dateKey => {
            if (combinedData[memberId] && combinedData[memberId][dateKey]) {
              const projectHours = projectData[memberId][dateKey];
              combinedData[memberId][dateKey].projectHours = projectHours;
              console.log(`🔍 WORKLOAD INVESTIGATION: Added ${projectHours} project hours for member ${memberId} on ${dateKey}`);
            }
          });
        });
      }
      
      // Add annual leave
      if (annualLeaveData) {
        console.log('🔍 WORKLOAD INVESTIGATION: Annual leave data received:', annualLeaveData);
        Object.keys(annualLeaveData).forEach(memberId => {
          Object.keys(annualLeaveData[memberId]).forEach(dateKey => {
            if (combinedData[memberId] && combinedData[memberId][dateKey]) {
              const leaveHours = annualLeaveData[memberId][dateKey];
              combinedData[memberId][dateKey].annualLeave = leaveHours;
              console.log(`🔍 WORKLOAD INVESTIGATION: Added ${leaveHours} annual leave hours for member ${memberId} on ${dateKey}`);
            }
          });
        });
      }
      
      // Add office holidays
      if (holidaysData) {
        console.log('🔍 WORKLOAD INVESTIGATION: Office holidays data received:', holidaysData);
        Object.keys(holidaysData).forEach(memberId => {
          Object.keys(holidaysData[memberId]).forEach(dateKey => {
            if (combinedData[memberId] && combinedData[memberId][dateKey]) {
              const holidayHours = holidaysData[memberId][dateKey];
              combinedData[memberId][dateKey].officeHolidays = holidayHours;
              console.log(`🔍 WORKLOAD INVESTIGATION: Added ${holidayHours} office holiday hours for member ${memberId} on ${dateKey}`);
            }
          });
        });
      }
      
      // Add other leave
      if (otherLeaveData) {
        console.log('🔍 WORKLOAD INVESTIGATION: Other leave data received:', otherLeaveData);
        Object.keys(otherLeaveData).forEach(memberId => {
          Object.keys(otherLeaveData[memberId]).forEach(dateKey => {
            if (combinedData[memberId] && combinedData[memberId][dateKey]) {
              const otherLeaveHours = otherLeaveData[memberId][dateKey];
              combinedData[memberId][dateKey].otherLeave = otherLeaveHours;
              console.log(`🔍 WORKLOAD INVESTIGATION: Added ${otherLeaveHours} other leave hours for member ${memberId} on ${dateKey}`);
            }
          });
        });
      }
      
      // Calculate totals for each day
      calculateTotals(combinedData);
      
      // Log detailed breakdown for Paul Julius on 2025-05-26 if he exists
      const paulJuliusId = teamMembers.find(m => 
        m.first_name === 'Paul' && m.last_name === 'Julius'
      )?.id;
      
      if (paulJuliusId && combinedData[paulJuliusId] && combinedData[paulJuliusId]['2025-05-26']) {
        const paulData = combinedData[paulJuliusId]['2025-05-26'];
        console.log('🔍 WORKLOAD INVESTIGATION: PAUL JULIUS BREAKDOWN for 2025-05-26:');
        console.log('🔍 Project Hours:', paulData.projectHours);
        console.log('🔍 Annual Leave:', paulData.annualLeave);
        console.log('🔍 Office Holidays:', paulData.officeHolidays);
        console.log('🔍 Other Leave:', paulData.otherLeave);
        console.log('🔍 CALCULATED TOTAL:', paulData.total);
        console.log('🔍 Full Paul data for all dates:', combinedData[paulJuliusId]);
      }
      
      // Convert the flat structure to MemberWorkloadData structure
      const finalWorkloadData: Record<string, MemberWorkloadData> = {};
      Object.keys(combinedData).forEach(memberId => {
        finalWorkloadData[memberId] = {
          daily: combinedData[memberId]
        };
      });
      
      console.log('🔍 WORKLOAD INVESTIGATION: Final comprehensive workload data (per day):', finalWorkloadData);
      setWorkloadData(finalWorkloadData);
      setIsLoadingWorkload(false);
    }
  }, [isLoadingProjects, isLoadingAnnualLeave, isLoadingHolidays, isLoadingOtherLeave, projectData, annualLeaveData, holidaysData, otherLeaveData, initialWorkloadData, teamMembers]);

  return { workloadData, isLoadingWorkload };
};
