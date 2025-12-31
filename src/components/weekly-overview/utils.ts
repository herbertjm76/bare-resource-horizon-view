import { format, startOfWeek, endOfWeek, parseISO, isValid } from 'date-fns';
import type { WeekStartDay } from '@/hooks/useAppSettings';
import { logger } from '@/utils/logger';

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
 * @param weeklyCapacity Weekly capacity of the resource
 * @returns Utilization percentage
 */
export const calculateUtilization = (hoursUsed: number, weeklyCapacity: number): number => {
  if (weeklyCapacity === 0) return 0;
  const percentage = (hoursUsed / weeklyCapacity) * 100;
  return Math.min(parseFloat(percentage.toFixed(1)), 100); // Cap at 100% and format to 1 decimal place
};

/**
 * Format a date to a week key based on company preference
 * 
 * @param date Date to format
 * @param weekStartDay Start day of work week from company settings
 * @returns Week key in YYYY-MM-DD format
 */
export const formatWeekKey = (date: Date, weekStartDay: WeekStartDay = 'Monday'): string => {
  const weekStartsOn = weekStartDay === 'Sunday' ? 0 : weekStartDay === 'Saturday' ? 6 : 1;
  const weekStart = startOfWeek(date, { weekStartsOn });
  const formattedDate = format(weekStart, 'yyyy-MM-dd');
  logger.debug(`formatWeekKey: Input date ${date.toISOString()}, ${weekStartDay} date: ${weekStart.toISOString()}, formatted: ${formattedDate}`);
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
 * Get the week start date from a given date based on company preference
 */
export const getWeekStartDate = (date: Date, weekStartDay: WeekStartDay = 'Monday'): Date => {
  const weekStartsOn = weekStartDay === 'Sunday' ? 0 : weekStartDay === 'Saturday' ? 6 : 1;
  return startOfWeek(date, { weekStartsOn });
};

/**
 * Get the week end date from a given date based on company preference
 */
export const getWeekEndDate = (date: Date, weekStartDay: WeekStartDay = 'Monday'): Date => {
  const weekStartsOn = weekStartDay === 'Sunday' ? 0 : weekStartDay === 'Saturday' ? 6 : 1;
  return endOfWeek(date, { weekStartsOn });
};

/**
 * Get a date range for a week (start and end dates) based on company preference
 * 
 * @param date Any date in the week
 * @param weekStartDay Start day of work week from company settings
 * @returns Object with startDate and endDate
 */
export const getWeekDateRange = (date: Date, weekStartDay: WeekStartDay = 'Monday') => {
  const startDate = getWeekStartDate(date, weekStartDay);
  const endDate = getWeekEndDate(date, weekStartDay);
  return { 
    startDate, 
    endDate,
    startDateString: format(startDate, 'yyyy-MM-dd'),
    endDateString: format(endDate, 'yyyy-MM-dd')
  };
};
