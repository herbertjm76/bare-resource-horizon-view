
import { format, startOfWeek, addWeeks } from 'date-fns';
import { TeamMember } from '@/components/dashboard/types';
import { ProcessedWorkloadResult, WeekStartDate } from '../types';
import { logger } from '@/utils/logger';

export const initializeWorkloadData = (
  members: TeamMember[],
  startDate: Date,
  numberOfWeeks: number
): ProcessedWorkloadResult => {
  const result: ProcessedWorkloadResult = {};
  
  // Initialize all members with empty weekly data
  members.forEach(member => {
    result[member.id] = {};
    
    // Initialize each week for this member
    // Ensure we're using Monday as the consistent week start for all calculations
    for (let weekIndex = 0; weekIndex < numberOfWeeks; weekIndex++) {
      const weekStart = addWeeks(startOfWeek(startDate, { weekStartsOn: 1 }), weekIndex);
      const weekKey = format(weekStart, 'yyyy-MM-dd');
      
      result[member.id][weekKey] = {
        projectHours: 0,
        annualLeave: 0,
        officeHolidays: 0,
        otherLeave: 0,
        total: 0,
        projects: []
      };
    }
  });

  logger.debug('Initialized workload data for:', {
    members: members.length,
    weeks: numberOfWeeks,
    totalEntries: Object.keys(result).length * numberOfWeeks
  });

  return result;
};

export const generateWeekStartDates = (
  startDate: Date,
  numberOfWeeks: number
): WeekStartDate[] => {
  const weekStartDates: WeekStartDate[] = [];
  
  // Ensure we start from Monday of the week containing startDate
  const normalizedStartDate = startOfWeek(startDate, { weekStartsOn: 1 });
  
  for (let i = 0; i < numberOfWeeks; i++) {
    const weekStart = addWeeks(normalizedStartDate, i);
    const weekKey = format(weekStart, 'yyyy-MM-dd');
    
    weekStartDates.push({
      date: weekStart,
      key: weekKey
    });
  }

  logger.debug('Generated week start dates:', {
    count: weekStartDates.length,
    firstWeek: weekStartDates[0]?.key,
    lastWeek: weekStartDates[weekStartDates.length - 1]?.key
  });

  return weekStartDates;
};

export const debugWorkloadData = (
  members: TeamMember[],
  result: ProcessedWorkloadResult,
  allocations: any[]
) => {
  logger.debug('=== WORKLOAD DATA DEBUG ===');
  
  // Log overall statistics
  const totalMembers = Object.keys(result).length;
  const totalWeeks = totalMembers > 0 ? Object.keys(result[Object.keys(result)[0]]).length : 0;
  const totalAllocations = allocations.length;
  
  logger.debug('Overall Stats:', {
    totalMembers,
    totalWeeks,
    totalAllocations,
    expectedEntries: totalMembers * totalWeeks
  });
  
  // Log sample data for first few members
  const sampleMembers = Object.keys(result).slice(0, 3);
  sampleMembers.forEach(memberId => {
    const member = members.find(m => m.id === memberId);
    const memberName = member ? `${member.first_name} ${member.last_name}` : memberId;
    
    logger.debug(`Member: ${memberName} (${memberId})`);
    
    const weekKeys = Object.keys(result[memberId]).sort();
    const sampleWeeks = weekKeys.slice(0, 5);
    
    sampleWeeks.forEach(weekKey => {
      const weekData = result[memberId][weekKey];
      logger.debug(`  Week ${weekKey}:`, {
        projectHours: weekData.projectHours,
        annualLeave: weekData.annualLeave,
        otherLeave: weekData.otherLeave,
        total: weekData.total,
        projectCount: weekData.projects.length
      });
    });
  });

  // Log allocation distribution
  const allocationsByMember = new Map<string, number>();
  allocations.forEach(allocation => {
    const current = allocationsByMember.get(allocation.resource_id) || 0;
    allocationsByMember.set(allocation.resource_id, current + (parseFloat(allocation.hours) || 0));
  });

  logger.debug('Allocation Totals by Member:', Array.from(allocationsByMember.entries()).slice(0, 5));
  
  logger.debug('=== END WORKLOAD DATA DEBUG ===');
};
