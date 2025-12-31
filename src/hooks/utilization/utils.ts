
import { format, startOfWeek, subWeeks, eachWeekOfInterval } from 'date-fns';
import { MemberAllocation, UtilizationPeriod } from './types';
import { logger } from '@/utils/logger';

export const getUtilizationPeriods = (currentWeekStart: Date): Record<string, UtilizationPeriod> => {
  return {
    days7: { startDate: currentWeekStart, periodName: '7-day' },
    days30: { startDate: subWeeks(currentWeekStart, 4), periodName: '30-day' },
    days90: { startDate: subWeeks(currentWeekStart, 12), periodName: '90-day' }
  };
};

export const calculatePeriodUtilization = (
  startDate: Date,
  currentWeekStart: Date,
  periodName: string,
  memberAllocations: MemberAllocation[],
  memberCapacity: number,
  memberId: string,
  memberName: string
): number => {
  const weeks = eachWeekOfInterval(
    { start: startDate, end: currentWeekStart },
    { weekStartsOn: 1 }
  );
  
  logger.debug(`${periodName} weeks to check:`, weeks.map(w => format(w, 'yyyy-MM-dd')));
  
  let totalAllocatedHours = 0;
  
  weeks.forEach(weekStart => {
    const weekKey = format(weekStart, 'yyyy-MM-dd');
    const weekAllocations = memberAllocations.filter(allocation => 
      allocation.allocation_date === weekKey
    );
    
    const weekHours = weekAllocations.reduce((sum, allocation) => {
      const hours = Number(allocation.hours) || 0;
      logger.debug(`  Week ${weekKey}: ${hours}h (project: ${allocation.project_id}, type: ${allocation.resource_type})`);
      return sum + hours;
    }, 0);
    
    totalAllocatedHours += weekHours;
    if (weekHours > 0) {
      logger.debug(`  Week ${weekKey} total: ${weekHours}h`);
    }
  });
  
  const totalCapacity = memberCapacity * weeks.length;
  const utilizationPercentage = totalCapacity > 0 ? Math.round((totalAllocatedHours / totalCapacity) * 100) : 0;
  
  logger.debug(`  ${periodName} - Total hours: ${totalAllocatedHours}, Capacity: ${totalCapacity}, Utilization: ${utilizationPercentage}%`);
  
  return Math.min(utilizationPercentage, 100); // Cap at 100%
};

export const initializeUtilizationMap = (teamMembers: any[]) => {
  const utilizationMap: Record<string, any> = {};
  teamMembers.forEach(member => {
    utilizationMap[member.id] = {
      memberId: member.id,
      days7: 0,
      days30: 0,
      days90: 0
    };
  });
  return utilizationMap;
};
