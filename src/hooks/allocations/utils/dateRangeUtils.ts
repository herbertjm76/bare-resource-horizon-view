/**
 * Date Range Utilities - RULEBOOK COMPLIANT
 * 
 * Uses the canonical allocationWeek module for all week key generation.
 * DO NOT use date-fns startOfWeek directly here.
 */

import { addDays, startOfMonth, endOfMonth } from 'date-fns';
import { logger } from '@/utils/logger';
import { 
  getAllocationWeekKey, 
  generateWeekKeysForPeriod,
  toUTCDateKey,
  parseUTCDateKey,
  type WeekStartDay 
} from '@/utils/allocationWeek';

export interface DateRange {
  startDate: string;
  endDate: string;
}

/**
 * Calculate standardized date range for resource allocation queries.
 * Uses the canonical week normalization from allocationWeek module.
 * 
 * @param selectedDate - Reference date
 * @param periodToShow - Number of weeks (if provided), otherwise uses month mode
 * @param weekStartDay - Company's week start preference (default: Monday)
 */
export function getStandardizedDateRange(
  selectedDate: Date, 
  periodToShow?: number,
  weekStartDay: WeekStartDay = 'Monday'
): DateRange {
  logger.debug(`🔍 DATE RANGE: Calculating range for ${selectedDate.toISOString()}, period: ${periodToShow || 'month'}, weekStart: ${weekStartDay}`);
  
  if (periodToShow && periodToShow > 0) {
    // For Project Resources view: use exact period in weeks from selected date
    const startWeekKey = getAllocationWeekKey(selectedDate, weekStartDay);
    const startDate = parseUTCDateKey(startWeekKey);
    
    // End is the start of the last week in the period
    const endDate = new Date(startDate);
    endDate.setUTCDate(endDate.getUTCDate() + ((periodToShow - 1) * 7));
    
    const range = {
      startDate: startWeekKey,
      endDate: toUTCDateKey(endDate)
    };
    
    logger.debug(`🔍 DATE RANGE: Project Resources mode - ${range.startDate} to ${range.endDate} (${periodToShow} weeks)`);
    return range;
  } else {
    // For Team Workload view: use full month range
    const monthStart = startOfMonth(selectedDate);
    const monthEnd = endOfMonth(selectedDate);
    
    // Get the week start containing the first day of the month
    const startWeekKey = getAllocationWeekKey(monthStart, weekStartDay);
    // Get the week start containing the last day of the month
    const endWeekKey = getAllocationWeekKey(monthEnd, weekStartDay);
    
    const range = {
      startDate: startWeekKey,
      endDate: endWeekKey
    };
    
    logger.debug(`🔍 DATE RANGE: Team Workload mode - ${range.startDate} to ${range.endDate} (full month)`);
    return range;
  }
}

/**
 * Generate week keys for a given date range.
 * Uses the canonical week normalization from allocationWeek module.
 * 
 * @param startDate - Start date string (YYYY-MM-DD)
 * @param endDate - End date string (YYYY-MM-DD)
 * @param weekStartDay - Company's week start preference (default: Monday)
 */
export function generateWeekKeys(
  startDate: string, 
  endDate: string,
  weekStartDay: WeekStartDay = 'Monday'
): string[] {
  const start = parseUTCDateKey(startDate);
  const end = parseUTCDateKey(endDate);
  
  // Normalize both to week starts
  const startWeekKey = getAllocationWeekKey(start, weekStartDay);
  const endWeekKey = getAllocationWeekKey(end, weekStartDay);
  
  const weeks: string[] = [];
  let currentDate = parseUTCDateKey(startWeekKey);
  const endWeekDate = parseUTCDateKey(endWeekKey);
  
  while (currentDate <= endWeekDate) {
    weeks.push(toUTCDateKey(currentDate));
    currentDate.setUTCDate(currentDate.getUTCDate() + 7);
  }
  
  logger.debug(`🔍 WEEK KEYS: Generated ${weeks.length} week keys:`, weeks);
  return weeks;
}

/**
 * Check if two date ranges overlap
 */
export function dateRangesOverlap(range1: DateRange, range2: DateRange): boolean {
  return range1.startDate <= range2.endDate && range2.startDate <= range1.endDate;
}
