
import { format, startOfWeek, endOfWeek } from 'date-fns';
import { TeamMember } from '@/components/dashboard/types';
import { WeeklyWorkloadBreakdown, WeekStartDate, ProcessedWorkloadData } from '../types/weeklyWorkloadTypes';
import { WorkloadRawData } from '../services/workloadDataService';

export const initializeWorkloadDataStructure = (
  teamMembers: TeamMember[],
  weekStartDates: WeekStartDate[]
): ProcessedWorkloadData => {
  const processedData: ProcessedWorkloadData = {};
  
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

  return processedData;
};

export const processProjectAllocations = (
  allocations: any[] | null,
  processedData: ProcessedWorkloadData
): void => {
  if (!allocations) return;

  allocations.forEach(allocation => {
    const memberId = allocation.resource_id;
    const weekKey = allocation.week_start_date;
    if (processedData[memberId] && processedData[memberId][weekKey]) {
      processedData[memberId][weekKey].projectHours += allocation.hours || 0;
    }
  });
};

export const processAnnualLeave = (
  leave: any[] | null,
  processedData: ProcessedWorkloadData
): void => {
  if (!leave) return;

  leave.forEach(leaveEntry => {
    const leaveDate = new Date(leaveEntry.date);
    const weekStart = startOfWeek(leaveDate, { weekStartsOn: 1 });
    const weekKey = format(weekStart, 'yyyy-MM-dd');
    const memberId = leaveEntry.member_id;
    
    if (processedData[memberId] && processedData[memberId][weekKey]) {
      processedData[memberId][weekKey].annualLeave += Number(leaveEntry.hours) || 0;
    }
  });
};

export const processOfficeHolidays = (
  holidays: any[] | null,
  teamMembers: TeamMember[],
  processedData: ProcessedWorkloadData
): void => {
  if (!holidays) return;

  holidays.forEach(holiday => {
    const holidayStart = new Date(holiday.date);
    const holidayEnd = holiday.end_date ? new Date(holiday.end_date) : holidayStart;
    
    // Calculate days in holiday period
    const daysDiff = Math.ceil((holidayEnd.getTime() - holidayStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    teamMembers.forEach(member => {
      // Check if member is affected by this holiday (location-based logic can be added here)
      const weeklyCapacity = member.weekly_capacity || 40;
      const dailyHours = weeklyCapacity / 5; // Assuming 5 working days per week
      
      for (let d = 0; d < daysDiff; d++) {
        const currentDate = new Date(holidayStart);
        currentDate.setDate(currentDate.getDate() + d);
        
        // Skip weekends
        if (currentDate.getDay() === 0 || currentDate.getDay() === 6) continue;
        
        const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
        const weekKey = format(weekStart, 'yyyy-MM-dd');
        
        if (processedData[member.id] && processedData[member.id][weekKey]) {
          processedData[member.id][weekKey].officeHolidays += dailyHours;
        }
      }
    });
  });
};

export const processOtherLeave = (
  otherLeave: any[] | null,
  processedData: ProcessedWorkloadData
): void => {
  if (!otherLeave) return;

  otherLeave.forEach(leave => {
    const memberId = leave.member_id;
    const weekKey = leave.week_start_date;
    if (processedData[memberId] && processedData[memberId][weekKey]) {
      processedData[memberId][weekKey].otherLeave += leave.hours || 0;
    }
  });
};

export const calculateTotals = (processedData: ProcessedWorkloadData): void => {
  Object.keys(processedData).forEach(memberId => {
    Object.keys(processedData[memberId]).forEach(weekKey => {
      const weekData = processedData[memberId][weekKey];
      weekData.total = weekData.projectHours + weekData.annualLeave + weekData.officeHolidays + weekData.otherLeave;
    });
  });
};

export const processWorkloadData = (
  rawData: WorkloadRawData,
  teamMembers: TeamMember[],
  weekStartDates: WeekStartDate[]
): ProcessedWorkloadData => {
  // Initialize the workload data structure
  const processedData = initializeWorkloadDataStructure(teamMembers, weekStartDates);

  // Process each data type
  processProjectAllocations(rawData.allocations, processedData);
  processAnnualLeave(rawData.leave, processedData);
  processOfficeHolidays(rawData.holidays, teamMembers, processedData);
  processOtherLeave(rawData.otherLeave, processedData);

  // Calculate totals
  calculateTotals(processedData);

  console.log('🔍 WEEKLY WORKLOAD: Final processed data completed');
  return processedData;
};
