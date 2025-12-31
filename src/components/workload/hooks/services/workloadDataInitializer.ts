import { format, addWeeks } from 'date-fns';
import { TeamMember } from '@/components/dashboard/types';
import { UnifiedWorkloadResult } from './types';
import { logger } from '@/utils/logger';

export const initializeWorkloadResult = (
  members: TeamMember[], 
  startDate: Date, 
  numberOfWeeks: number
): UnifiedWorkloadResult => {
  const result: UnifiedWorkloadResult = {};
  
  logger.debug('🔄 WORKLOAD INITIALIZER: Creating week structure', {
    startDate: format(startDate, 'yyyy-MM-dd'),
    numberOfWeeks,
    memberCount: members.length
  });
  
  const weekKeys: string[] = [];
  
  members.forEach(member => {
    result[member.id] = {};
    for (let week = 0; week < numberOfWeeks; week++) {
      // Use addWeeks for proper date arithmetic - startDate is already normalized
      const weekStart = addWeeks(startDate, week);
      const weekKey = format(weekStart, 'yyyy-MM-dd');
      
      if (member === members[0]) { // Only log for first member to avoid spam
        weekKeys.push(weekKey);
      }
      
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

  logger.debug('🔄 WORKLOAD INITIALIZER: Week keys created', {
    weekKeys: weekKeys.slice(0, 5), // First 5 weeks
    totalWeeks: weekKeys.length
  });

  return result;
};