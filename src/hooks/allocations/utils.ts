
/**
 * Format date strings consistently for use as keys in allocation objects
 * 
 * @param dateString Date string in any format
 * @returns Date string in YYYY-MM-DD format
 */
export const formatDateKey = (dateString: string): string => {
  // Ensure we have a consistent date format (YYYY-MM-DD)
  try {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  } catch (error) {
    // If the date is already in the correct format, return as is
    return dateString;
  }
};

/**
 * Generate a week key from a date
 * 
 * @param date Date object
 * @returns Date string in YYYY-MM-DD format for the start of the week
 */
export const getWeekKey = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/**
 * Calculate utilization percentage based on allocated hours and capacity
 * 
 * @param allocatedHours Total allocated hours
 * @param capacity Total capacity (e.g., 40 hours per week)
 * @returns Utilization percentage
 */
export const calculateUtilization = (allocatedHours: number, capacity: number): number => {
  if (capacity === 0) return 0;
  return (allocatedHours / capacity) * 100;
};
