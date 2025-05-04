
import { format, startOfWeek } from 'date-fns';

/**
 * Format a number to 1 decimal place
 */
export const formatNumber = (num: number): string => {
  if (isNaN(num)) return '0';
  return Number(num.toFixed(1)).toString();
};

/**
 * Calculate utilization percentage based on hours used and capacity
 * 
 * @param hoursUsed Number of hours used by the resource
 * @param weeklyCapacity Weekly capacity of the resource (default: 40)
 * @returns Utilization percentage
 */
export const calculateUtilization = (hoursUsed: number, weeklyCapacity: number = 40): number => {
  if (weeklyCapacity === 0) return 0;
  const percentage = (hoursUsed / weeklyCapacity) * 100;
  return Math.min(parseFloat(percentage.toFixed(1)), 100); // Cap at 100% and format to 1 decimal place
};

/**
 * Format a date to a week key (YYYY-MM-DD format of Monday)
 * 
 * @param date Date to format
 * @returns Week key in YYYY-MM-DD format
 */
export const formatWeekKey = (date: Date): string => {
  // Explicitly set to start on Monday (1)
  const monday = startOfWeek(date, { weekStartsOn: 1 });
  // Format to YYYY-MM-DD for consistent database queries
  return format(monday, 'yyyy-MM-dd');
};
