
import { format, addDays, startOfMonth, endOfMonth } from 'date-fns';
import { TeamMember } from '@/components/dashboard/types';
import { WorkloadBreakdown, DailyWorkloadBreakdown } from '../types';

export const initializeWorkloadData = (selectedMonth: Date, teamMembers: TeamMember[]): Record<string, Record<string, DailyWorkloadBreakdown>> => {
  const monthStart = startOfMonth(selectedMonth);
  const monthEnd = endOfMonth(selectedMonth);
  
  const workloadData: Record<string, Record<string, DailyWorkloadBreakdown>> = {};
  
  teamMembers.forEach(member => {
    workloadData[member.id] = {};
    
    // Generate all days in the month
    let currentDate = monthStart;
    while (currentDate <= monthEnd) {
      const dateKey = format(currentDate, 'yyyy-MM-dd');
      workloadData[member.id][dateKey] = {
        projectHours: 0,
        annualLeave: 0,
        officeHolidays: 0,
        otherLeave: 0,
        total: 0,
        totalHours: 0 // Alias for compatibility
      };
      currentDate = addDays(currentDate, 1);
    }
  });
  
  return workloadData;
};

export const calculateTotals = (workloadData: Record<string, Record<string, DailyWorkloadBreakdown>>): void => {
  Object.keys(workloadData).forEach(memberId => {
    Object.keys(workloadData[memberId]).forEach(dateKey => {
      const dayData = workloadData[memberId][dateKey];
      const total = dayData.projectHours + dayData.annualLeave + dayData.officeHolidays + dayData.otherLeave;
      dayData.total = total;
      dayData.totalHours = total; // Set the alias
    });
  });
};
