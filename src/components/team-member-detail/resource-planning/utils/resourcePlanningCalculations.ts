
interface WeekData {
  total: number;
  projects: any[];
}

interface FutureWeeksData {
  [weekKey: string]: WeekData;
}

export const calculatePlanningMetrics = (
  futureAllocations: any[],
  weeklyCapacity: number
) => {
  // Calculate planning metrics with null checks
  const futureWeeksData: FutureWeeksData = futureAllocations?.reduce((acc: FutureWeeksData, allocation) => {
    const weekKey = allocation.week_start_date;
    if (!acc[weekKey]) {
      acc[weekKey] = { total: 0, projects: [] };
    }
    acc[weekKey].total += allocation.hours || 0;
    if (allocation.project) {
      acc[weekKey].projects.push(allocation.project);
    }
    return acc;
  }, {} as FutureWeeksData) || {};

  const averageFutureUtilization = Object.keys(futureWeeksData).length > 0 
    ? Object.values(futureWeeksData).reduce((sum, week) => {
        return sum + ((week.total / weeklyCapacity) * 100);
      }, 0) / Object.keys(futureWeeksData).length
    : 0;

  const overallocatedWeeks = Object.values(futureWeeksData).filter(week => week.total > weeklyCapacity).length;
  const underutilizedWeeks = Object.values(futureWeeksData).filter(week => week.total < weeklyCapacity * 0.8).length;

  return {
    averageFutureUtilization,
    overallocatedWeeks,
    underutilizedWeeks
  };
};

export const calculateHistoricalMetrics = (
  historicalData: any[],
  weeklyCapacity: number
) => {
  // Calculate historical average with null checks
  const historicalAverage = historicalData && historicalData.length > 0
    ? historicalData.reduce((sum, allocation) => sum + (allocation.hours || 0), 0) / historicalData.length
    : 0;
  const historicalUtilization = (historicalAverage / weeklyCapacity) * 100;

  return {
    historicalAverage,
    historicalUtilization
  };
};
