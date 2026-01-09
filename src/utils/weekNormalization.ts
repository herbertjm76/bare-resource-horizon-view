import { startOfWeek, format } from 'date-fns';
import type { WeekStartDay } from '@/hooks/useAppSettings';

/**
 * CRITICAL: Normalize any date to the company's week start day.
 * 
 * This is the SINGLE SOURCE OF TRUTH for week normalization.
 * All allocation operations MUST use this function.
 * 
 * The database has a trigger that also enforces this as a safety net,
 * but we normalize client-side for:
 * 1. Consistent local state
 * 2. Correct cache keys
 * 3. Proper UI display
 * 
 * @param dateInput - Date object or YYYY-MM-DD string
 * @param weekStartDay - Company's week start preference (REQUIRED - no default to force explicit usage)
 * @returns YYYY-MM-DD string for the week start
 */
export function normalizeToWeekStart(
  dateInput: Date | string, 
  weekStartDay: WeekStartDay
): string {
  let date: Date;
  
  if (typeof dateInput === 'string') {
    // Parse as UTC to avoid timezone issues
    date = new Date(dateInput.split('T')[0] + 'T00:00:00Z');
  } else {
    date = dateInput;
  }
  
  const weekStartsOn = weekStartDay === 'Sunday' ? 0 
    : weekStartDay === 'Saturday' ? 6 
    : 1; // Monday default
  
  const weekStart = startOfWeek(date, { weekStartsOn });
  return format(weekStart, 'yyyy-MM-dd');
}

/**
 * Get the week start Date object based on company preference.
 * 
 * @param date - Date to get week start for
 * @param weekStartDay - Company's week start preference
 * @returns Date object for the week start
 */
export function getWeekStartDate(date: Date, weekStartDay: WeekStartDay): Date {
  const weekStartsOn = weekStartDay === 'Sunday' ? 0 
    : weekStartDay === 'Saturday' ? 6 
    : 1; // Monday default
    
  return startOfWeek(date, { weekStartsOn });
}

/**
 * Validate that a date matches the expected week start day.
 * Logs a warning if the date doesn't match.
 * 
 * @param dateKey - YYYY-MM-DD string to validate
 * @param weekStartDay - Expected week start day
 * @param context - Optional context for debugging
 */
export function assertIsWeekStart(
  dateKey: string, 
  weekStartDay: WeekStartDay,
  context?: string
): void {
  const date = new Date(dateKey + 'T00:00:00Z');
  const dayOfWeek = date.getUTCDay();
  
  const expectedDay = weekStartDay === 'Sunday' ? 0 
    : weekStartDay === 'Saturday' ? 6 
    : 1; // Monday
  
  if (dayOfWeek !== expectedDay) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const message = `CRITICAL: allocation_date should be ${weekStartDay} but got ${days[dayOfWeek]} (${dateKey})${context ? ` in ${context}` : ''}`;
    console.warn(message);
    
    // In development, throw to catch issues early
    if (process.env.NODE_ENV === 'development') {
      console.error('⚠️ Week start mismatch detected. The database trigger will fix this, but the code should be using normalizeToWeekStart()');
    }
  }
}
