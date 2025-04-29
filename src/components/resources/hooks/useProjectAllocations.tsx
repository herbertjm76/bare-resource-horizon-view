
import { useState, useMemo } from 'react';

export const useProjectAllocations = (weeks: { startDate: Date }[]) => {
  // Track all allocations by resource and week
  const [projectAllocations, setProjectAllocations] = useState<Record<string, Record<string, number>>>({});

  // Sum up all resource hours for each week
  const weeklyProjectHours = useMemo(() => {
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

  // Handle resource allocation changes
  const handleAllocationChange = (resourceId: string, weekKey: string, hours: number) => {
    setProjectAllocations(prev => ({
      ...prev,
      [resourceId]: {
        ...(prev[resourceId] || {}),
        [weekKey]: hours
      }
    }));
  };

  return {
    projectAllocations,
    weeklyProjectHours,
    handleAllocationChange,
    setProjectAllocations
  };
};
