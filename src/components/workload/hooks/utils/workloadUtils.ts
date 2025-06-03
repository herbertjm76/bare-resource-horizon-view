
import { format, addDays, startOfWeek, endOfWeek } from 'date-fns';
import { TeamMember } from '@/components/dashboard/types';
import { WorkloadBreakdown, DailyWorkloadBreakdown } from '../types';

export const initializeWorkloadData = (selectedDate: Date, teamMembers: TeamMember[], periodWeeks: number = 1): Record<string, Record<string, DailyWorkloadBreakdown>> => {
  const startDate = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const endDate = endOfWeek(addDays(startDate, (periodWeeks - 1) * 7), { weekStartsOn: 1 });
  
  console.log('🔍 WORKLOAD UTILS: Initializing workload data from', format(startDate, 'yyyy-MM-dd'), 'to', format(endDate, 'yyyy-MM-dd'));
  console.log('🔍 WORKLOAD UTILS: Period weeks:', periodWeeks);
  
  const workloadData: Record<string, Record<string, DailyWorkloadBreakdown>> = {};
  
  teamMembers.forEach(member => {
    workloadData[member.id] = {};
    
    // Generate all days in the period
    let currentDate = startDate;
    while (currentDate <= endDate) {
      const dateKey = format(currentDate, 'yyyy-MM-dd');
      workloadData[member.id][dateKey] = {
        projectHours: 0,
        annualLeave: 0,
        officeHolidays: 0,
        otherLeave: 0,
        total: 0,
        totalHours: 0 // Alias for compatibility
      };
      
      if (member.first_name === 'Paul' && member.last_name === 'Julius') {
        console.log(`🔍 WORKLOAD UTILS: Initialized Paul Julius data for ${dateKey}`);
      }
      
      currentDate = addDays(currentDate, 1);
    }
  });
  
  console.log('🔍 WORKLOAD UTILS: Initialized workload data structure:', workloadData);
  return workloadData;
};

export const calculateTotals = (workloadData: Record<string, Record<string, DailyWorkloadBreakdown>>): void => {
  console.log('🔍 WORKLOAD UTILS: Calculating totals for workload data');
  
  Object.keys(workloadData).forEach(memberId => {
    Object.keys(workloadData[memberId]).forEach(dateKey => {
      const dayData = workloadData[memberId][dateKey];
      const total = dayData.projectHours + dayData.annualLeave + dayData.officeHolidays + dayData.otherLeave;
      dayData.total = total;
      dayData.totalHours = total; // Set the alias
      
      // Log calculation for Paul Julius on the specific date
      if (memberId.includes('Paul') || dateKey === '2025-05-26') {
        const member = Object.keys(workloadData).find(id => id === memberId);
        if (member) {
          console.log(`🔍 WORKLOAD UTILS: Calculated total for member ${memberId} on ${dateKey}:`, {
            projectHours: dayData.projectHours,
            annualLeave: dayData.annualLeave,
            officeHolidays: dayData.officeHolidays,
            otherLeave: dayData.otherLeave,
            calculatedTotal: total
          });
        }
      }
    });
  });
};
