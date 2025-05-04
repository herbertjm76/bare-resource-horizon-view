
import { format, startOfWeek, endOfWeek, parseISO, isValid } from 'date-fns';

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
  const formattedDate = format(monday, 'yyyy-MM-dd');
  console.log(`formatWeekKey: Input date ${date.toISOString()}, Monday date: ${monday.toISOString()}, formatted: ${formattedDate}`);
  return formattedDate;
};

/**
 * Format date string to YYYY-MM-DD format
 * 
 * @param dateStr Date string to format
 * @returns Formatted date string
 */
export const formatDateString = (dateStr: string): string => {
  try {
    if (!dateStr) return '';
    const date = parseISO(dateStr);
    if (!isValid(date)) return dateStr;
    return format(date, 'yyyy-MM-dd');
  } catch (e) {
    console.error('Error formatting date string:', dateStr, e);
    return dateStr;
  }
};

/**
 * Get the week start date (Monday) from a given date
 */
export const getWeekStartDate = (date: Date): Date => {
  return startOfWeek(date, { weekStartsOn: 1 });
};

/**
 * Get the week end date (Sunday) from a given date
 */
export const getWeekEndDate = (date: Date): Date => {
  return endOfWeek(date, { weekStartsOn: 1 });
};

/**
 * Get a date range for a week (start and end dates)
 * 
 * @param date Any date in the week
 * @returns Object with startDate and endDate
 */
export const getWeekDateRange = (date: Date) => {
  const startDate = getWeekStartDate(date);
  const endDate = getWeekEndDate(date);
  return { 
    startDate, 
    endDate,
    startDateString: format(startDate, 'yyyy-MM-dd'),
    endDateString: format(endDate, 'yyyy-MM-dd')
  };
};
