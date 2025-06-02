
import { useMemo } from 'react';
import { format } from 'date-fns';
import { useProjectResources } from './useProjectResources';

interface DayInfo {
  date: Date;
  label: string;
  dayName: string;
  monthLabel: string;
  isWeekend: boolean;
  isSunday: boolean;
  isFirstOfMonth: boolean;
  isEndOfWeek?: boolean;
}

export const useProjectRowData = (project: any, days: DayInfo[]) => {
  const {
    resources,
    projectAllocations,
    showAddResource,
    isLoading,
    isLoadingAllocations,
    setShowAddResource,
    handleAllocationChange,
    handleDeleteResource,
    handleAddResource,
    checkResourceInOtherProjects,
    getAllocationKey
  } = useProjectResources(project.id);

  // Helper to get day key for allocation lookup
  const getDayKey = (date: Date): string => {
    return format(date, 'yyyy-MM-dd');
  };
  
  // Sum up all resource hours for each day
  const dailyProjectHours = useMemo(() => {
    const dailyHours: Record<string, number> = {};
    days.forEach(day => {
      const dayKey = getDayKey(day.date);
      dailyHours[dayKey] = 0;
      
      // Sum up hours for this day across all resources
      resources.forEach(resource => {
        const allocationKey = `${resource.id}:${dayKey}`;
        const hours = projectAllocations[allocationKey] || 0;
        dailyHours[dayKey] += hours;
      });
    });
    return dailyHours;
  }, [days, resources, projectAllocations]);
  
  // Calculate total project hours
  const totalProjectHours = useMemo(() => {
    return Object.values(dailyProjectHours).reduce((sum, hours) => sum + hours, 0);
  }, [dailyProjectHours]);

  return {
    resources,
    projectAllocations,
    showAddResource,
    isLoading,
    isLoadingAllocations,
    dailyProjectHours,
    totalProjectHours,
    getDayKey,
    setShowAddResource,
    handleAllocationChange,
    handleDeleteResource,
    handleAddResource,
    checkResourceInOtherProjects,
    getAllocationKey
  };
};
