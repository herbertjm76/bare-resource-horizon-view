/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ALLOCATION WEEK RULEBOOK (CANONICAL)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * This is the SINGLE SOURCE OF TRUTH for all allocation week key logic.
 * 
 * ─────────────────────────────────────────────────────────────────────────────
 * CORE RULES
 * ─────────────────────────────────────────────────────────────────────────────
 * 1. All allocation_date values are UTC date keys (YYYY-MM-DD)
 * 2. All allocation_date values must fall on the company's week start day
 * 3. The database trigger enforces normalization on insert/update
 * 4. Frontend must use these utilities for consistency
 * 
 * ─────────────────────────────────────────────────────────────────────────────
 * TIMEZONE SAFETY RULES (CRITICAL)
 * ─────────────────────────────────────────────────────────────────────────────
 * 
 * NEVER use these date-fns functions directly for allocation/week logic:
 *   ❌ startOfWeek()     - Uses local timezone, causes date drift
 *   ❌ endOfWeek()       - Uses local timezone, causes date drift  
 *   ❌ format(date, 'yyyy-MM-dd') - Uses local timezone for output
 *   ❌ new Date().getDay() - Uses local timezone
 * 
 * ALWAYS use these UTC-safe utilities instead:
 *   ✅ getAllocationWeekKey(date, weekStartDay) - Canonical week key
 *   ✅ getWeekStartDate(date, weekStartDay)     - UTC-safe Date object
 *   ✅ toUTCDateKey(date)                       - UTC-safe YYYY-MM-DD string
 *   ✅ parseUTCDateKey(dateKey)                 - Parse as UTC midnight
 *   ✅ date.getUTCDay()                         - UTC day of week
 * 
 * WHY THIS MATTERS:
 * - A user in UTC-5 viewing "Monday Jan 12" at 11pm local = "Tuesday Jan 13" UTC
 * - date-fns startOfWeek() would compute week start in local time → WRONG WEEK
 * - This causes allocations to appear missing or duplicated across views
 * 
 * EXAMPLES OF BUGS CAUSED BY LOCAL TIMEZONE:
 * - Weekly Overview shows different allocations than Resource Scheduling
 * - Allocations "disappear" when viewed from different timezones
 * - Week boundaries shift by ±1 day causing data mismatches
 * 
 * ─────────────────────────────────────────────────────────────────────────────
 * IMPORT GUIDANCE
 * ─────────────────────────────────────────────────────────────────────────────
 * 
 * For any component/hook dealing with weeks or allocations, import from:
 *   import { getAllocationWeekKey, getWeekStartDate, toUTCDateKey } from '@/utils/allocationWeek';
 * 
 * DO NOT import getWeekStartDate from '@/components/weekly-overview/utils'
 * (that file uses local-time date-fns functions - legacy, avoid for week logic)
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { toUTCDateKey, parseUTCDateKey } from './dateKey';
import { normalizeToWeekStart, getWeekStartDate } from './weekNormalization';
import type { WeekStartDay } from '@/hooks/useAppSettings';

// Re-export the type for convenience
export type { WeekStartDay };

/**
 * Get the canonical allocation week key for any date.
 * This is the primary function for generating week keys for allocations.
 * 
 * @param dateInput - Any Date object or YYYY-MM-DD string
 * @param weekStartDay - Company's week start preference (default: Monday)
 * @returns YYYY-MM-DD string representing the week start
 */
export const getAllocationWeekKey = (
  dateInput: Date | string,
  weekStartDay: WeekStartDay = 'Monday'
): string => {
  return normalizeToWeekStart(dateInput, weekStartDay);
};

/**
 * Get the week range (start and end) for a given week key.
 * 
 * @param weekKey - The week start key (YYYY-MM-DD, must be on week start day)
 * @returns Object with start and end date keys (end is 6 days after start)
 */
export const getWeekRange = (weekKey: string): { start: string; end: string } => {
  const startDate = parseUTCDateKey(weekKey);
  const endDate = new Date(startDate);
  endDate.setUTCDate(endDate.getUTCDate() + 6);
  
  return {
    start: weekKey,
    end: toUTCDateKey(endDate)
  };
};

/**
 * Generate an array of week keys for a period starting from a given date.
 * 
 * @param startDate - Start date for the period
 * @param weekCount - Number of weeks to generate
 * @param weekStartDay - Company's week start preference
 * @returns Array of week key strings
 */
export const generateWeekKeysForPeriod = (
  startDate: Date | string,
  weekCount: number,
  weekStartDay: WeekStartDay = 'Monday'
): string[] => {
  const firstWeekKey = getAllocationWeekKey(startDate, weekStartDay);
  const firstWeekDate = parseUTCDateKey(firstWeekKey);
  
  const keys: string[] = [];
  for (let i = 0; i < weekCount; i++) {
    const weekDate = new Date(firstWeekDate);
    weekDate.setUTCDate(weekDate.getUTCDate() + (i * 7));
    keys.push(toUTCDateKey(weekDate));
  }
  
  return keys;
};

/**
 * Build allocation query range for fetching allocations over a period.
 * 
 * @param selectedDate - The reference date (usually "today" or selected week)
 * @param periodWeeks - Number of weeks to include (default: 12)
 * @param weekStartDay - Company's week start preference
 * @returns Object with startWeekKey and endWeekKey for database queries
 */
export const buildAllocationQueryRange = (
  selectedDate: Date,
  periodWeeks: number = 12,
  weekStartDay: WeekStartDay = 'Monday'
): { startWeekKey: string; endWeekKey: string } => {
  const startWeekKey = getAllocationWeekKey(selectedDate, weekStartDay);
  const startWeekDate = parseUTCDateKey(startWeekKey);
  
  const endWeekDate = new Date(startWeekDate);
  endWeekDate.setUTCDate(endWeekDate.getUTCDate() + ((periodWeeks - 1) * 7));
  
  return {
    startWeekKey,
    endWeekKey: toUTCDateKey(endWeekDate)
  };
};

/**
 * Build allocation query range going backward from a selected date.
 * Useful for historical views.
 * 
 * @param selectedDate - The reference date
 * @param weeksBack - Number of weeks to go back
 * @param weeksForward - Number of weeks to go forward (default: 0)
 * @param weekStartDay - Company's week start preference
 * @returns Object with startWeekKey and endWeekKey
 */
export const buildAllocationQueryRangeSymmetric = (
  selectedDate: Date,
  weeksBack: number,
  weeksForward: number = 0,
  weekStartDay: WeekStartDay = 'Monday'
): { startWeekKey: string; endWeekKey: string } => {
  const currentWeekKey = getAllocationWeekKey(selectedDate, weekStartDay);
  const currentWeekDate = parseUTCDateKey(currentWeekKey);
  
  const startWeekDate = new Date(currentWeekDate);
  startWeekDate.setUTCDate(startWeekDate.getUTCDate() - (weeksBack * 7));
  
  const endWeekDate = new Date(currentWeekDate);
  endWeekDate.setUTCDate(endWeekDate.getUTCDate() + (weeksForward * 7));
  
  return {
    startWeekKey: toUTCDateKey(startWeekDate),
    endWeekKey: toUTCDateKey(endWeekDate)
  };
};

/**
 * Assert that a date key is on the expected week start day.
 * Use this in development to catch bugs early.
 * 
 * @param dateKey - The date key to validate
 * @param weekStartDay - Expected week start day
 * @param context - Optional context for error message
 * @throws Warning in development if date is not on week start
 */
export const assertValidWeekKey = (
  dateKey: string,
  weekStartDay: WeekStartDay = 'Monday',
  context?: string
): boolean => {
  const date = parseUTCDateKey(dateKey);
  const expectedDow = weekStartDay === 'Sunday' ? 0 : weekStartDay === 'Saturday' ? 6 : 1;
  const actualDow = date.getUTCDay();
  
  if (actualDow !== expectedDow) {
    const message = `[AllocationWeek] Invalid week key "${dateKey}" - expected ${weekStartDay} (dow=${expectedDow}), got dow=${actualDow}${context ? ` in ${context}` : ''}`;
    
    if (import.meta.env.DEV) {
      console.error(message);
    }
    
    return false;
  }
  
  return true;
};

/**
 * Compare two week keys to determine their order.
 * 
 * @param weekKeyA - First week key
 * @param weekKeyB - Second week key
 * @returns -1 if A < B, 0 if A === B, 1 if A > B
 */
export const compareWeekKeys = (weekKeyA: string, weekKeyB: string): number => {
  if (weekKeyA < weekKeyB) return -1;
  if (weekKeyA > weekKeyB) return 1;
  return 0;
};

/**
 * Check if a week key falls within a range (inclusive).
 * 
 * @param weekKey - The week key to check
 * @param startKey - Range start (inclusive)
 * @param endKey - Range end (inclusive)
 * @returns true if weekKey is within the range
 */
export const isWeekKeyInRange = (
  weekKey: string,
  startKey: string,
  endKey: string
): boolean => {
  return weekKey >= startKey && weekKey <= endKey;
};

/**
 * Get the "current week" key based on today's date.
 * 
 * @param weekStartDay - Company's week start preference
 * @returns Week key for the current week
 */
export const getCurrentWeekKey = (weekStartDay: WeekStartDay = 'Monday'): string => {
  return getAllocationWeekKey(new Date(), weekStartDay);
};

// Re-export commonly used functions from other modules for convenience
export { toUTCDateKey, parseUTCDateKey } from './dateKey';
export { getWeekStartDate } from './weekNormalization';
