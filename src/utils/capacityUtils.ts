/**
 * Utility functions for capacity calculations
 * These functions provide consistent fallback behavior using company settings
 */

/**
 * Get a member's weekly capacity with proper fallback
 * Prefers member's individual capacity, falls back to company's workWeekHours
 * 
 * @param memberCapacity - The member's individual weekly_capacity (may be null/undefined)
 * @param workWeekHours - The company's default work week hours from settings
 * @returns The capacity to use for calculations
 */
export const getMemberCapacity = (
  memberCapacity: number | null | undefined,
  workWeekHours: number
): number => {
  return memberCapacity ?? workWeekHours;
};

/**
 * Calculate utilization percentage
 * @param allocatedHours - Hours allocated
 * @param capacity - Total capacity
 * @returns Utilization percentage (0-100+)
 */
export const calculateUtilization = (
  allocatedHours: number,
  capacity: number
): number => {
  if (capacity <= 0) return 0;
  return Math.round((allocatedHours / capacity) * 100);
};

/**
 * Calculate available hours
 * @param capacity - Total capacity
 * @param allocatedHours - Hours already allocated
 * @returns Available hours (minimum 0)
 */
export const calculateAvailableHours = (
  capacity: number,
  allocatedHours: number
): number => {
  return Math.max(0, capacity - allocatedHours);
};
