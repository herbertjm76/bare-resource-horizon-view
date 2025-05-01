
import React from 'react';

/**
 * Interface for week data structure
 */
interface Week {
  startDate: Date;
  label?: string;
}

/**
 * Hook to calculate the total hours allocated to a project per week
 * 
 * @param projectAllocations - Record of resource allocations by resource ID and then by week key
 * @param weeks - Array of week objects containing startDate
 * @returns Record of total hours per week keyed by week start date string
 */
export const useWeeklyProjectHours = (
  projectAllocations: Record<string, Record<string, number | string | null | undefined>>, 
  weeks: Week[]
): Record<string, number> => {
  // Sum up all resource hours for each week using useMemo to prevent unnecessary recalculations
  return React.useMemo(() => {
    // Early return if no data
    if (!projectAllocations || !weeks || weeks.length === 0) {
      console.warn('useWeeklyProjectHours called with empty data');
      return {};
    }

    try {
      const weekHours: Record<string, number> = {};

      // Initialize all weeks with 0 hours
      weeks.forEach(week => {
        if (!week.startDate) {
          console.warn('Week missing startDate:', week);
          return;
        }

        const weekKey = week.startDate instanceof Date 
          ? week.startDate.toISOString().split('T')[0] 
          : String(week.startDate);
          
        weekHours[weekKey] = 0;
      });

      // Sum up hours across all resources
      Object.entries(projectAllocations).forEach(([resourceId, resourceAlloc]) => {
        if (!resourceAlloc) {
          console.debug(`No allocations for resource: ${resourceId}`);
          return;
        }
        
        console.debug(`Processing resource ${resourceId} allocations:`, resourceAlloc);
        
        Object.entries(resourceAlloc).forEach(([weekKey, hours]) => {
          if (weekHours[weekKey] === undefined) {
            // Skip if the week isn't in our list of weeks to render
            return;
          }
          
          // Convert hours to number, handling various input types
          const numericHours = parseFloat(Number(hours || 0).toFixed(2));
          
          // Only add valid numbers
          if (!isNaN(numericHours)) {
            weekHours[weekKey] += numericHours;
            console.debug(`Added ${numericHours} to week ${weekKey}, total now: ${weekHours[weekKey]}`);
          } else {
            console.warn(`Invalid hours value for week ${weekKey}:`, hours);
          }
        });
      });
      
      // Log the calculated hours for debugging
      console.debug('Weekly project hours calculated:', weekHours);
      
      return weekHours;
    } catch (error) {
      console.error('Error calculating weekly project hours:', error);
      // Return an empty object on error to avoid breaking the UI
      return {};
    }
  }, [projectAllocations, weeks]);
};
