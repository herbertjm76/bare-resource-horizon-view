
import { useState, useEffect, useMemo } from 'react';
import { useCompany } from '@/context/CompanyContext';
import { TeamMember } from '@/components/dashboard/types';
import { useComprehensiveAllocations } from '@/components/week-resourcing/hooks/useComprehensiveAllocations';
import { useWeeklyLeaveDetails } from '@/components/week-resourcing/hooks/useWeeklyLeaveDetails';
import { useOfficeHolidays } from './useOfficeHolidays';
import { format, startOfWeek, addWeeks } from 'date-fns';

export interface WeeklyWorkloadBreakdown {
  projectHours: number;
  annualLeave: number;
  officeHolidays: number;
  otherLeave: number;
  total: number;
}

export const useWeeklyWorkloadData = (selectedDate: Date, teamMembers: TeamMember[], periodWeeks: number = 4) => {
  const [weeklyWorkloadData, setWeeklyWorkloadData] = useState<Record<string, Record<string, WeeklyWorkloadBreakdown>>>({});
  const [isLoadingWorkload, setIsLoadingWorkload] = useState<boolean>(true);
  const { company } = useCompany();

  // Generate week start dates for the period
  const weekStartDates = useMemo(() => {
    const weeks = [];
    const startWeek = startOfWeek(selectedDate, { weekStartsOn: 1 });
    
    for (let i = 0; i < periodWeeks; i++) {
      const weekStart = addWeeks(startWeek, i);
      weeks.push({
        date: weekStart,
        key: format(weekStart, 'yyyy-MM-dd')
      });
    }
    
    return weeks;
  }, [selectedDate, periodWeeks]);

  // Get member IDs
  const memberIds = useMemo(() => teamMembers.map(member => member.id), [teamMembers]);

  // Fetch comprehensive allocations for all weeks
  const weeklyAllocationsData = weekStartDates.map(week => {
    const { comprehensiveWeeklyAllocations } = useComprehensiveAllocations({
      weekStartDate: week.key,
      memberIds
    });
    return { weekKey: week.key, allocations: comprehensiveWeeklyAllocations || [] };
  });

  // Fetch leave data for all weeks
  const weeklyLeaveData = weekStartDates.map(week => {
    const { weeklyLeaveDetails } = useWeeklyLeaveDetails({
      weekStartDate: week.key,
      memberIds
    });
    return { weekKey: week.key, leaveDetails: weeklyLeaveDetails || [] };
  });

  // Fetch holiday data for the entire period
  const { data: holidaysData, isLoading: isLoadingHolidays } = useOfficeHolidays(
    selectedDate, 
    teamMembers, 
    company?.id, 
    periodWeeks
  );

  // Process and combine all data
  useEffect(() => {
    if (!company?.id || teamMembers.length === 0) {
      setIsLoadingWorkload(false);
      setWeeklyWorkloadData({});
      return;
    }

    console.log('🔍 WEEKLY WORKLOAD: Processing weekly workload data for', teamMembers.length, 'members');
    console.log('🔍 WEEKLY WORKLOAD: Period weeks:', periodWeeks);
    console.log('🔍 WEEKLY WORKLOAD: Week start dates:', weekStartDates.map(w => w.key));

    const processedData: Record<string, Record<string, WeeklyWorkloadBreakdown>> = {};

    // Initialize data structure
    teamMembers.forEach(member => {
      processedData[member.id] = {};
      weekStartDates.forEach(week => {
        processedData[member.id][week.key] = {
          projectHours: 0,
          annualLeave: 0,
          officeHolidays: 0,
          otherLeave: 0,
          total: 0
        };
      });
    });

    // Process project allocations
    weeklyAllocationsData.forEach(({ weekKey, allocations }) => {
      allocations.forEach(allocation => {
        const memberId = allocation.resource_id;
        if (processedData[memberId] && processedData[memberId][weekKey]) {
          processedData[memberId][weekKey].projectHours += allocation.hours || 0;
        }
      });
    });

    // Process annual leave
    weeklyLeaveData.forEach(({ weekKey, leaveDetails }) => {
      if (Array.isArray(leaveDetails)) {
        leaveDetails.forEach(leave => {
          const memberId = leave.member_id;
          if (processedData[memberId] && processedData[memberId][weekKey]) {
            processedData[memberId][weekKey].annualLeave += leave.hours || 0;
          }
        });
      }
    });

    // Process office holidays
    if (holidaysData) {
      Object.keys(holidaysData).forEach(memberId => {
        Object.keys(holidaysData[memberId]).forEach(dateKey => {
          // Find which week this date belongs to
          const weekKey = weekStartDates.find(week => {
            const weekStart = new Date(week.key);
            const weekEnd = addWeeks(weekStart, 1);
            const checkDate = new Date(dateKey);
            return checkDate >= weekStart && checkDate < weekEnd;
          })?.key;

          if (weekKey && processedData[memberId] && processedData[memberId][weekKey]) {
            processedData[memberId][weekKey].officeHolidays += holidaysData[memberId][dateKey] || 0;
          }
        });
      });
    }

    // Calculate totals
    Object.keys(processedData).forEach(memberId => {
      Object.keys(processedData[memberId]).forEach(weekKey => {
        const weekData = processedData[memberId][weekKey];
        weekData.total = weekData.projectHours + weekData.annualLeave + weekData.officeHolidays + weekData.otherLeave;
      });
    });

    console.log('🔍 WEEKLY WORKLOAD: Final processed data:', processedData);
    setWeeklyWorkloadData(processedData);
    setIsLoadingWorkload(false);
  }, [company?.id, teamMembers, weekStartDates, weeklyAllocationsData, weeklyLeaveData, holidaysData]);

  return { 
    weeklyWorkloadData, 
    isLoadingWorkload, 
    weekStartDates 
  };
};
