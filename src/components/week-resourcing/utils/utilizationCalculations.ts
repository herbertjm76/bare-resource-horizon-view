
/**
 * Standardized utilization calculations for the Weekly Overview
 * This ensures consistency across all components
 */

/**
 * Calculate total PROJECT hours for a member from the allocation map
 */
export const calculateMemberProjectHours = (
  memberId: string, 
  allocationMap: Map<string, number>
): number => {
  let totalHours = 0;
  
  allocationMap.forEach((hours, key) => {
    const [resourceId] = key.split(':');
    if (resourceId === memberId) {
      totalHours += hours;
    }
  });
  
  return totalHours;
};

/**
 * Calculate utilization percentage (PROJECT hours only)
 * @param projectHours - Total project hours for the week
 * @param weeklyCapacity - Weekly capacity (default 40 hours)
 * @returns Utilization percentage (0-100+)
 */
export const calculateUtilizationPercentage = (
  projectHours: number,
  weeklyCapacity: number = 40
): number => {
  if (weeklyCapacity <= 0) return 0;
  return Math.round((projectHours / weeklyCapacity) * 100);
};

/**
 * Get utilization status color based on percentage
 */
export const getUtilizationColor = (utilizationPercentage: number): string => {
  if (utilizationPercentage > 100) return 'text-red-600';
  if (utilizationPercentage > 80) return 'text-orange-600';
  return 'text-green-600';
};

/**
 * Count unique projects a member is allocated to
 */
export const calculateMemberProjectCount = (
  memberId: string,
  allocationMap: Map<string, number>
): number => {
  const projectSet = new Set<string>();
  
  allocationMap.forEach((hours, key) => {
    const [resourceId, projectId] = key.split(':');
    if (resourceId === memberId && hours > 0) {
      projectSet.add(projectId);
    }
  });
  
  return projectSet.size;
};
