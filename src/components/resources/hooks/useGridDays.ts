
import { useMemo } from 'react';
import { format, addDays, isWeekend, isSunday, startOfMonth, eachDayOfInterval, addWeeks } from 'date-fns';

interface DayInfo {
  date: Date;
  label: string;
  dayName: string;
  monthLabel: string;
  isWeekend: boolean;
  isSunday: boolean;
  isFirstOfMonth: boolean;
}

interface DisplayOptions {
  showWeekends: boolean;
  showWorkdaysOnly: boolean;
}

export const useGridDays = (
  startDate: Date,
  periodToShow: number,
  displayOptions: DisplayOptions
): DayInfo[] => {
  return useMemo(() => {
    const monthStart = startOfMonth(startDate);
    const endDate = addWeeks(monthStart, periodToShow / 4); // Convert weeks to months (approx)
    
    let allDays = eachDayOfInterval({
      start: monthStart,
      end: endDate
    });
    
    // Filter days based on display options
    if (!displayOptions.showWeekends) {
      allDays = allDays.filter(day => !isWeekend(day));
    } else if (displayOptions.showWorkdaysOnly) {
      allDays = allDays.filter(day => {
        const dayOfWeek = day.getDay();
        return dayOfWeek !== 0 && dayOfWeek !== 6; // Filter out Sunday (0) and Saturday (6)
      });
    }
    
    return allDays.map(day => {
      return {
        date: day,
        label: format(day, 'd'), // Day of month
        dayName: format(day, 'EEE'), // Short day name (Mon, Tue, etc.)
        monthLabel: format(day, 'MMM'), // Short month name
        isWeekend: isWeekend(day),
        isSunday: isSunday(day),
        isFirstOfMonth: day.getDate() === 1
      };
    });
  }, [startDate, periodToShow, displayOptions.showWeekends, displayOptions.showWorkdaysOnly]);
};
