import { useMemo } from 'react';
import { format, addWeeks, startOfWeek, eachWeekOfInterval, endOfWeek } from 'date-fns';
import { logger } from '@/utils/logger';

export interface WeekInfo {
  weekStartDate: Date;
  weekEndDate: Date;
  weekLabel: string; // e.g., "Jan 1-7"
  monthLabel: string; // e.g., "Jan"
  weekNumber: number; // Week number in the year
  isPreviousWeek: boolean;
}

interface DisplayOptions {
  weekStartsOnSunday: boolean;
}

export const useGridWeeks = (
  startDate: Date,
  periodToShow: number, // Number of weeks to show
  displayOptions: DisplayOptions
): WeekInfo[] => {
  return useMemo(() => {
    // Check if mobile/tablet viewport (up to 1024px)
    const isMobileOrTablet = typeof window !== 'undefined' && window.innerWidth <= 1024;
    
    // Determine week start day: 0 = Sunday, 1 = Monday
    const weekStartsOn = displayOptions.weekStartsOnSunday ? 0 : 1;
    
    // Adjust start date to beginning of week
    const adjustedStartDate = startOfWeek(startDate, { weekStartsOn });
    
    // Only include previous week on desktop, not on mobile/tablet
    const previousWeekStartDate = isMobileOrTablet 
      ? adjustedStartDate 
      : addWeeks(adjustedStartDate, -1);
    
    // Calculate end date based on periodToShow
    const endDate = addWeeks(adjustedStartDate, periodToShow - 1);
    
    // Get all weeks in the interval
    const allWeeks = eachWeekOfInterval(
      {
        start: previousWeekStartDate,
        end: endDate
      },
      { weekStartsOn }
    );
    
    logger.debug('Grid weeks debug:', {
      weekStartsOnSunday: displayOptions.weekStartsOnSunday,
      originalStartDate: startDate,
      adjustedStartDate,
      totalWeeks: allWeeks.length,
      periodToShow
    });
    
    return allWeeks.map((weekStart) => {
      const weekEnd = endOfWeek(weekStart, { weekStartsOn });
      
      // Check if this is the previous week
      const isPreviousWeek = weekStart < adjustedStartDate;
      
      // Format week label
      const startDay = format(weekStart, 'd');
      const endDay = format(weekEnd, 'd');
      const startMonth = format(weekStart, 'MMM');
      const endMonth = format(weekEnd, 'MMM');
      
      // If same month: "Jan 1-7", if different months: "Jan 30-Feb 5"
      const weekLabel = startMonth === endMonth 
        ? `${startMonth} ${startDay}-${endDay}`
        : `${startMonth} ${startDay}-${endMonth} ${endDay}`;
      
      // Get week number
      const weekNumber = parseInt(format(weekStart, 'w'), 10);
      
      return {
        weekStartDate: weekStart,
        weekEndDate: weekEnd,
        weekLabel,
        monthLabel: startMonth,
        weekNumber,
        isPreviousWeek
      };
    });
  }, [
    startDate, 
    periodToShow, 
    displayOptions.weekStartsOnSunday
  ]);
};
