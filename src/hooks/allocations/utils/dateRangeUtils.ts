import { format, addDays, startOfMonth, endOfMonth, startOfWeek } from 'date-fns';
import { logger } from '@/utils/logger';

// Local helper - always uses Monday for backward compatibility in date range queries
const getWeekStartDate = (date: Date): Date => startOfWeek(date, { weekStartsOn: 1 });

export interface DateRange {
  startDate: string;
  endDate: string;
}

/**
 * Calculate standardized date range for resource allocation queries
 * This ensures consistent date ranges between Team Workload and Project Resources views
 */
export function getStandardizedDateRange(
  selectedDate: Date, 
  periodToShow?: number
): DateRange {
  logger.debug(`🔍 DATE RANGE: Calculating range for ${selectedDate.toISOString()}, period: ${periodToShow || 'month'}`);
  
  if (periodToShow && periodToShow > 0) {
    // For Project Resources view: use exact period in weeks from selected date
    const startDate = getWeekStartDate(selectedDate);
    const endDate = addDays(startDate, (periodToShow * 7) - 1);
    
    const range = {
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(getWeekStartDate(endDate), 'yyyy-MM-dd') // Ensure end is also a Monday
    };
    
    logger.debug(`🔍 DATE RANGE: Project Resources mode - ${range.startDate} to ${range.endDate} (${periodToShow} weeks)`);
    return range;
  } else {
    // For Team Workload view: use full month range
    const monthStart = startOfMonth(selectedDate);
    const monthEnd = endOfMonth(selectedDate);
    
    // Get the Monday of the week containing the first day of the month
    const startDate = getWeekStartDate(monthStart);
    // Get the Monday of the week containing the last day of the month
    const endDate = getWeekStartDate(monthEnd);
    
    const range = {
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd')
    };
    
    logger.debug(`🔍 DATE RANGE: Team Workload mode - ${range.startDate} to ${range.endDate} (full month)`);
    return range;
  }
}

/**
 * Generate Monday-based week keys for a given date range
 * This is used to create consistent week identifiers across the application
 */
export function generateWeekKeys(startDate: string, endDate: string): string[] {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const weeks: string[] = [];
  
  let current = getWeekStartDate(start);
  const endWeek = getWeekStartDate(end);
  
  while (current <= endWeek) {
    weeks.push(format(current, 'yyyy-MM-dd'));
    current = addDays(current, 7); // Move to next Monday
  }
  
  logger.debug(`🔍 WEEK KEYS: Generated ${weeks.length} week keys:`, weeks);
  return weeks;
}

/**
 * Check if two date ranges overlap
 */
export function dateRangesOverlap(range1: DateRange, range2: DateRange): boolean {
  const start1 = new Date(range1.startDate);
  const end1 = new Date(range1.endDate);
  const start2 = new Date(range2.startDate);
  const end2 = new Date(range2.endDate);
  
  return start1 <= end2 && start2 <= end1;
}