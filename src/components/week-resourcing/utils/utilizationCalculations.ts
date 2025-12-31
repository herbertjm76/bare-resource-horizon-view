import { logger } from '@/utils/logger';

/**
 * STANDARDIZED utilization calculations for the Weekly Overview
 * This ensures consistency across ALL components in the weekly resource view
 * 
 * IMPORTANT: All components MUST use these functions to ensure consistent calculations
 */

/**
 * Calculate total PROJECT hours for a member from the allocation map
 * This is the ONLY function that should be used to calculate member project hours
 */
export const calculateMemberProjectHours = (
  memberId: string, 
  allocationMap: Map<string, number>
): number => {
  let totalHours = 0;
  
  logger.debug(`calculateMemberProjectHours for ${memberId} - AllocationMap size:`, allocationMap.size);
  
  allocationMap.forEach((hours, key) => {
    const [resourceId] = key.split(':');
    if (resourceId === memberId) {
      totalHours += hours;
    }
  });
  
  logger.debug(`calculateMemberProjectHours for ${memberId}:`, {
    totalProjectHours: totalHours
  });
  
  return totalHours;
};

/**
 * Calculate utilization percentage (PROJECT hours + LEAVE hours)
 * This is the ONLY function that should be used to calculate utilization percentage
 * @param projectHours - Total project hours for the week
 * @param weeklyCapacity - Weekly capacity (REQUIRED - use workWeekHours from useAppSettings)
 * @param leaveHours - Optional total leave hours (annual + holiday + other)
 * @returns Utilization percentage (0-100+)
 */
export const calculateUtilizationPercentage = (
  projectHours: number,
  weeklyCapacity: number,
  leaveHours: number = 0
): number => {
  if (weeklyCapacity <= 0) return 0;
  const totalHours = projectHours + leaveHours;
  const percentage = Math.round((totalHours / weeklyCapacity) * 100);
  
  logger.debug(`calculateUtilizationPercentage:`, {
    projectHours,
    leaveHours,
    totalHours,
    weeklyCapacity,
    calculatedPercentage: percentage
  });
  
  return percentage;
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

/**
 * STANDARDIZED calculation for capacity display
 * Returns both project hours and capacity for consistent display
 * Now includes leave hours in utilization calculation
 * @param memberId - The member's ID
 * @param allocationMap - Map of allocations
 * @param weeklyCapacity - Weekly capacity (REQUIRED - use workWeekHours from useAppSettings)
 * @param leaveHours - Total leave hours
 */
export const calculateCapacityDisplay = (
  memberId: string,
  allocationMap: Map<string, number>,
  weeklyCapacity: number,
  leaveHours: number = 0
): { projectHours: number; capacity: number; utilizationPercentage: number; totalHours: number } => {
  const projectHours = calculateMemberProjectHours(memberId, allocationMap);
  const totalHours = projectHours + leaveHours;
  const utilizationPercentage = calculateUtilizationPercentage(projectHours, weeklyCapacity, leaveHours);
  
  logger.debug(`calculateCapacityDisplay for ${memberId}:`, {
    projectHours,
    leaveHours,
    totalHours,
    capacity: weeklyCapacity,
    utilizationPercentage
  });
  
  return {
    projectHours,
    capacity: weeklyCapacity,
    utilizationPercentage,
    totalHours
  };
};
