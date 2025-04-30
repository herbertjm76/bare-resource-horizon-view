
/**
 * Formats a number to have 0 decimal places
 */
export const formatNumber = (num: number): string => {
  return num.toFixed(0);
};

/**
 * Calculates the utilization percentage
 */
export const calculateUtilization = (allocated: number, capacity: number): number => {
  if (capacity === 0) return 0;
  return (allocated / capacity) * 100;
};

// Add any other utility functions here
