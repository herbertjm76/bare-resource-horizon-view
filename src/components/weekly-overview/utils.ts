
/**
 * Format a number to show only one decimal place when needed
 */
export const formatNumber = (value: number): string => {
  if (Number.isInteger(value)) {
    return value.toString();
  }
  return value.toFixed(1);
};

/**
 * Calculate utilization percentage based on hours and capacity
 */
export const calculateUtilization = (hours: number, capacity: number = 40): number => {
  if (capacity === 0) return 0;
  return Math.min(100, (hours / capacity) * 100);
};

/**
 * Calculate resource capacity based on project hours
 * Normally would be standard 40, but can be adjusted based on other factors
 */
export const calculateCapacity = (projectHours: number): number => {
  // For now, just return 40 as standard work week
  return 40;
};
