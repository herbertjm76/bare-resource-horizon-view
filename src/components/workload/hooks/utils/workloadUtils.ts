
import { format, eachDayOfInterval, startOfMonth, endOfMonth } from 'date-fns';
import { TeamMember } from '@/components/dashboard/types';
import { WorkloadBreakdown } from '../types';

export const initializeWorkloadData = (
  selectedMonth: Date, 
  teamMembers: TeamMember[]
): Record<string, Record<string, WorkloadBreakdown>> => {
  const workload: Record<string, Record<string, WorkloadBreakdown>> = {};
  
  // Get all days in the selected month
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(selectedMonth),
    end: endOfMonth(selectedMonth)
  });
  
  teamMembers.forEach(member => {
    workload[member.id] = {};
    daysInMonth.forEach(day => {
      const dateKey = format(day, 'yyyy-MM-dd');
      workload[member.id][dateKey] = {
        projectHours: 0,
        annualLeave: 0,
        officeHolidays: 0,
        otherLeave: 0,
        total: 0
      };
    });
  });
  
  return workload;
};

export const calculateTotals = (
  workload: Record<string, Record<string, WorkloadBreakdown>>
): void => {
  Object.keys(workload).forEach(memberId => {
    Object.keys(workload[memberId]).forEach(dateKey => {
      const breakdown = workload[memberId][dateKey];
      breakdown.total = breakdown.projectHours + breakdown.annualLeave + breakdown.officeHolidays + breakdown.otherLeave;
    });
  });
};
