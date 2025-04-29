
import React from 'react';

export const useWeeklyProjectHours = (
  projectAllocations: Record<string, Record<string, number>>, 
  weeks: { startDate: Date }[]
) => {
  // Sum up all resource hours for each week
  return React.useMemo(() => {
    const weekHours: Record<string, number> = {};

    // Initialize all weeks with 0 hours
    weeks.forEach(week => {
      const weekKey = week.startDate.toISOString().split('T')[0];
      weekHours[weekKey] = 0;
    });

    // Sum up hours across all resources
    Object.values(projectAllocations).forEach(resourceAlloc => {
      Object.entries(resourceAlloc).forEach(([weekKey, hours]) => {
        if (weekHours[weekKey] !== undefined) {
          weekHours[weekKey] += hours;
        }
      });
    });
    
    return weekHours;
  }, [projectAllocations, weeks]);
};
