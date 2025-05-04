import { format, startOfWeek } from 'date-fns';

/**
 * Format a number for display
 */
export const formatNumber = (num: number): string | number => {
  // Return empty string for 0 values
  if (num === 0) return '0';
  // Return formatted number for other values
  return num;
};

/**
 * Calculate utilization percentage
 */
export const calculateUtilization = (hours: number, capacity: number = 40): number => {
  if (capacity <= 0) return 0;
  const percentage = (hours / capacity) * 100;
  return Math.round(percentage);
};

/**
 * Calculate capacity value
 */
export const calculateCapacity = (hours: number): number => {
  // For now, just return the hours as capacity
  return hours;
};

/**
 * Format a date into a standard week key format (YYYY-MM-DD)
 * Always returns the Monday of the week
 */
export const formatWeekKey = (date: Date): string => {
  // Get Monday of the current week
  const mondayDate = startOfWeek(date, { weekStartsOn: 1 });
  // Format as YYYY-MM-DD
  return format(mondayDate, 'yyyy-MM-dd');
};
