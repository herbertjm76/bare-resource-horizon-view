
import { useMemo } from 'react';
import { ProjectAllocations } from './types/resourceTypes';

/**
 * Calculate total project hours for each week from all resource allocations
 * @param projectAllocations - All resource allocations for the project
 * @param weeks - Array of week data
 * @returns Record of week keys to total hours
 */
export const useWeeklyProjectHours = (
  projectAllocations: ProjectAllocations,
  weeks: {
    startDate: Date;
    label: string;
    days: Date[];
  }[]
) => {
  return useMemo(() => {
    // Create an object to hold weekly totals
    const weeklyHours: Record<string, number> = {};
    
    // Initialize all weeks with 0 hours
    weeks.forEach(week => {
      const weekKey = week.startDate.toISOString().split('T')[0];
      weeklyHours[weekKey] = 0;
    });
    
    // Sum up hours for each week
    Object.entries(projectAllocations).forEach(([key, hours]) => {
      // Parse the composite key (format: resourceId:weekKey)
      const [_, weekKey] = key.split(':');
      
      if (weekKey && weeklyHours.hasOwnProperty(weekKey)) {
        weeklyHours[weekKey] += hours;
      }
    });
    
    return weeklyHours;
  }, [projectAllocations, weeks]);
};
