import { WeekStartDay } from '@/hooks/useAppSettings';

/**
 * Get the start of week date based on company preference
 */
export const getWeekStart = (date: Date, weekStartDay: WeekStartDay): Date => {
  const result = new Date(date);
  const day = result.getDay();
  
  let diff = 0;
  if (weekStartDay === 'Monday') {
    // Monday = 1, Sunday = 0
    diff = day === 0 ? -6 : 1 - day;
  } else if (weekStartDay === 'Sunday') {
    // Sunday = 0
    diff = -day;
  } else if (weekStartDay === 'Saturday') {
    // Saturday = 6
    diff = day === 6 ? 0 : -(day + 1);
  }
  
  result.setDate(result.getDate() + diff);
  result.setHours(0, 0, 0, 0);
  return result;
};

/**
 * Get the end of week date based on company preference
 */
export const getWeekEnd = (date: Date, weekStartDay: WeekStartDay): Date => {
  const weekStart = getWeekStart(date, weekStartDay);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);
  return weekEnd;
};

/**
 * Format a week range based on company preference
 */
export const formatWeekRange = (date: Date, weekStartDay: WeekStartDay): string => {
  const weekStart = getWeekStart(date, weekStartDay);
  const weekEnd = getWeekEnd(date, weekStartDay);
  
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  const startStr = weekStart.toLocaleDateString(undefined, options);
  const endStr = weekEnd.toLocaleDateString(undefined, options);
  
  return `${startStr} - ${endStr}`;
};
