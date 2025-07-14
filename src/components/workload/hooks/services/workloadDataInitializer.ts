import { format, startOfWeek } from 'date-fns';
import { TeamMember } from '@/components/dashboard/types';
import { UnifiedWorkloadResult } from './types';

export const initializeWorkloadResult = (
  members: TeamMember[], 
  startDate: Date, 
  numberOfWeeks: number
): UnifiedWorkloadResult => {
  const result: UnifiedWorkloadResult = {};
  
  members.forEach(member => {
    result[member.id] = {};
    for (let week = 0; week < numberOfWeeks; week++) {
      const weekStart = new Date(startDate);
      weekStart.setDate(weekStart.getDate() + (week * 7));
      const weekKey = format(startOfWeek(weekStart, { weekStartsOn: 1 }), 'yyyy-MM-dd');
      
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

  return result;
};