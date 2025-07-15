import { addDays, addMonths, endOfMonth, format, startOfWeek, startOfMonth, addWeeks } from 'date-fns';
import { DateRange, WeekInfo, DateRangeOptions } from '@/types/dateRange';

/**
 * Centralized service for all date range calculations used across the application.
 * Handles standardized date ranges, week generation, and date overlap detection.
 */
export class DateRangeCalculationService {
  /**
   * Gets the Monday of the selected week
   */
  static getWeekStartDate(date: Date): Date {
    return startOfWeek(date, { weekStartsOn: 1 }); // 1 = Monday
  }

  /**
   * Calculates a standardized date range based on the selected date and options.
   * Used for both Project Resources view (with periodToShow) and Team Workload view (full months).
   */
  static getStandardizedDateRange(
    selectedDate: Date, 
    options: DateRangeOptions = {}
  ): DateRange {
    const { periodToShow } = options;
    
    console.log(`🔍 DATE RANGE: Calculating range for ${selectedDate.toISOString()}, period: ${periodToShow || 'month'}`);
    
    if (periodToShow && periodToShow > 0) {
      // For Project Resources view: use exact period in weeks from selected date
      const startDate = this.getWeekStartDate(selectedDate);
      const endDate = addDays(startDate, (periodToShow * 7) - 1);
      
      const range = {
        startDate: format(startDate, 'yyyy-MM-dd'),
        endDate: format(this.getWeekStartDate(endDate), 'yyyy-MM-dd') // Ensure end is also a Monday
      };
      
      console.log(`🔍 DATE RANGE: Project Resources mode - ${range.startDate} to ${range.endDate} (${periodToShow} weeks)`);
      return range;
    } else {
      // For Team Workload view: use full month range
      const monthStart = startOfMonth(selectedDate);
      const monthEnd = endOfMonth(selectedDate);
      
      // Get the Monday of the week containing the first day of the month
      const startDate = this.getWeekStartDate(monthStart);
      // Get the Monday of the week containing the last day of the month
      const endDate = this.getWeekStartDate(monthEnd);
      
      const range = {
        startDate: format(startDate, 'yyyy-MM-dd'),
        endDate: format(endDate, 'yyyy-MM-dd')
      };
      
      console.log(`🔍 DATE RANGE: Team Workload mode - ${range.startDate} to ${range.endDate} (full month)`);
      return range;
    }
  }

  /**
   * Generates an array of Monday-based week keys within a given date range.
   */
  static generateWeekKeys(startDate: string, endDate: string): string[] {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const weeks: string[] = [];
    
    let current = this.getWeekStartDate(start);
    const endWeek = this.getWeekStartDate(end);
    
    while (current <= endWeek) {
      weeks.push(format(current, 'yyyy-MM-dd'));
      current = addDays(current, 7); // Move to next Monday
    }
    
    console.log(`🔍 WEEK KEYS: Generated ${weeks.length} week keys:`, weeks);
    return weeks;
  }

  /**
   * Generates an array of week start dates for calendar views.
   */
  static generateWeekStartDates(startDate: Date, numberOfWeeks: number): WeekInfo[] {
    const weeks: WeekInfo[] = [];
    let currentDate = startOfWeek(startDate, { weekStartsOn: 1 }); // Monday start
    
    for (let i = 0; i < numberOfWeeks; i++) {
      weeks.push({
        date: new Date(currentDate),
        key: format(currentDate, 'yyyy-MM-dd')
      });
      currentDate = addWeeks(currentDate, 1);
    }
    
    return weeks;
  }

  /**
   * Checks if two date ranges overlap.
   */
  static dateRangesOverlap(range1: DateRange, range2: DateRange): boolean {
    const start1 = new Date(range1.startDate);
    const end1 = new Date(range1.endDate);
    const start2 = new Date(range2.startDate);
    const end2 = new Date(range2.endDate);
    
    return start1 <= end2 && start2 <= end1;
  }

  /**
   * Gets the appropriate grid start date based on selected month and weekend preferences.
   */
  static getGridStartDate(selectedMonth: Date, weekStartsOnSunday: boolean = false): Date {
    return startOfWeek(selectedMonth, { weekStartsOn: weekStartsOnSunday ? 0 : 1 });
  }

  /**
   * Formats a date for display in month labels.
   */
  static formatMonthLabel(date: Date): string {
    return format(date, 'MMMM yyyy');
  }

  /**
   * Gets both Monday and Sunday dates for the selected week
   * to handle databases that might use either as week start
   */
  static getWeekStartOptions(selectedWeek: Date) {
    // Get the Monday of the selected week
    const monday = this.getWeekStartDate(selectedWeek);
    
    // Get the Sunday of the selected week (this is for databases that start weeks on Sunday)
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() - 1);
    
    // Format both dates for database queries
    const mondayKey = format(monday, 'yyyy-MM-dd');
    const sundayKey = format(sunday, 'yyyy-MM-dd');
    
    return { monday, sunday, mondayKey, sundayKey };
  }

  /**
   * Gets the full range for a week (all days)
   */
  static getWeekDateRange(selectedWeek: Date) {
    const startDate = this.getWeekStartDate(selectedWeek);
    
    // End date is 6 days after start (full week)
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    
    const startDateString = format(startDate, 'yyyy-MM-dd');
    const endDateString = format(endDate, 'yyyy-MM-dd');
    
    return { startDate, endDate, startDateString, endDateString };
  }
}