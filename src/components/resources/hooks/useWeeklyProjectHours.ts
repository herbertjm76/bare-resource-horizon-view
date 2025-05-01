
import React from 'react';

export const useWeeklyProjectHours = (
  projectAllocations: Record<string, number>, 
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

    // Sum up hours across all allocations
    Object.entries(projectAllocations).forEach(([compositeKey, hours]) => {
      // Extract the weekKey from the composite key (format: resourceId:weekKey)
      const weekKey = compositeKey.split(':')[1];
      
      if (weekHours[weekKey] !== undefined) {
        weekHours[weekKey] += Number(hours); // Ensure we're adding numbers
      }
    });
    
    return weekHours;
  }, [projectAllocations, weeks]);
};
