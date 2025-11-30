
import { useMemo } from 'react';
import { format, addWeeks, startOfWeek, eachWeekOfInterval, endOfWeek } from 'date-fns';

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
    
    // On mobile/tablet, only show current week
    if (isMobileOrTablet) {
      const today = new Date();
      const currentWeekStart = startOfWeek(today, { weekStartsOn });
      const currentWeekEnd = endOfWeek(currentWeekStart, { weekStartsOn });
      
      return [{
        weekStartDate: currentWeekStart,
        weekEndDate: currentWeekEnd,
        weekLabel: (() => {
          const startDay = format(currentWeekStart, 'd');
          const endDay = format(currentWeekEnd, 'd');
          const startMonth = format(currentWeekStart, 'MMM');
          const endMonth = format(currentWeekEnd, 'MMM');
          return startMonth === endMonth 
            ? `${startMonth} ${startDay}-${endDay}`
            : `${startMonth} ${startDay}-${endMonth} ${endDay}`;
        })(),
        monthLabel: format(currentWeekStart, 'MMM'),
        weekNumber: parseInt(format(currentWeekStart, 'w'), 10),
        isPreviousWeek: false
      }];
    }
    
    // Desktop: include previous week and all selected weeks
    const previousWeekStartDate = addWeeks(adjustedStartDate, -1);
    
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
    
    console.log('Grid weeks debug:', {
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
