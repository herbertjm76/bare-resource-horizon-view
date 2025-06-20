
import { useMemo } from 'react';
import { format, addDays, isWeekend, isSunday, eachDayOfInterval, addWeeks, startOfWeek } from 'date-fns';
import { DayInfo } from '../grid/types';

interface DisplayOptions {
  showWeekends: boolean;
  selectedDays: string[];
  weekStartsOnSunday: boolean;
}

// Map day of week number to day ID in our system
const dayOfWeekToId = (day: number, weekStartsOnSunday: boolean): string => {
  // If week starts on Sunday, day 0 is Sunday
  // If week starts on Monday, day 0 is Monday, day 6 is Sunday
  const daysMap = weekStartsOnSunday 
    ? ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] 
    : ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
  
  return daysMap[day];
};

// Get the day of week (0-6) based on our system
const getDayOfWeek = (date: Date, weekStartsOnSunday: boolean): number => {
  // JavaScript: 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  let day = date.getDay();
  
  if (!weekStartsOnSunday) {
    // Convert to Monday = 0, ..., Sunday = 6
    day = day === 0 ? 6 : day - 1;
  }
  
  return day;
};

// Get single letter day abbreviation
const getSingleLetterDay = (date: Date): string => {
  const dayNames = ['S', 'M', 'T', 'W', 'Th', 'F', 'Sa'];
  return dayNames[date.getDay()];
};

// Check if a day is weekend based on week start preference
const isWeekendDay = (date: Date, weekStartsOnSunday: boolean): boolean => {
  const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
  
  if (weekStartsOnSunday) {
    // If week starts on Sunday, weekend is Friday (5) and Saturday (6)
    return dayOfWeek === 5 || dayOfWeek === 6;
  } else {
    // If week starts on Monday, weekend is Saturday (6) and Sunday (0)
    return dayOfWeek === 0 || dayOfWeek === 6;
  }
};

export const useGridDays = (
  startDate: Date,
  periodToShow: number,
  displayOptions: DisplayOptions
): DayInfo[] => {
  return useMemo(() => {
    // Adjust start date based on week start preference
    let adjustedStartDate: Date;
    if (displayOptions.weekStartsOnSunday) {
      // Week starts on Sunday (day 0)
      adjustedStartDate = startOfWeek(startDate, { weekStartsOn: 0 });
    } else {
      // Week starts on Monday (day 1)
      adjustedStartDate = startOfWeek(startDate, { weekStartsOn: 1 });
    }
    
    // Convert periodToShow from weeks to days for eachDayOfInterval
    const daysToAdd = periodToShow * 7;
    const endDate = addDays(adjustedStartDate, daysToAdd - 1);
    
    let allDays = eachDayOfInterval({
      start: adjustedStartDate,
      end: endDate
    });
    
    console.log('Grid days debug:', {
      weekStartsOnSunday: displayOptions.weekStartsOnSunday,
      originalStartDate: startDate,
      adjustedStartDate,
      selectedDays: displayOptions.selectedDays,
      showWeekends: displayOptions.showWeekends,
      totalDays: allDays.length
    });
    
    // Filter days based on display options
    allDays = allDays.filter(day => {
      // Get the day ID for the current date (e.g., 'mon', 'tue', etc.)
      const dayOfWeek = getDayOfWeek(day, displayOptions.weekStartsOnSunday);
      const dayId = dayOfWeekToId(dayOfWeek, displayOptions.weekStartsOnSunday);
      
      // Check if this day is a weekend based on our week start preference
      const isWeekendForThisSystem = isWeekendDay(day, displayOptions.weekStartsOnSunday);
      
      console.log(`Day ${format(day, 'EEE')} (${dayId}):`, {
        isWeekendForThisSystem,
        isInSelectedDays: displayOptions.selectedDays.includes(dayId),
        showWeekends: displayOptions.showWeekends
      });
      
      // Weekend handling - ensure weekends are shown if showWeekends is true
      if (isWeekendForThisSystem) {
        return displayOptions.showWeekends && displayOptions.selectedDays.includes(dayId);
      }
      
      // For non-weekend days, check if they are in the selectedDays list
      return displayOptions.selectedDays.includes(dayId);
    });
    
    return allDays.map((day, index, days) => {
      const dayOfWeek = getDayOfWeek(day, displayOptions.weekStartsOnSunday);
      const lastDayOfWeek = displayOptions.weekStartsOnSunday ? 6 : 6; // Saturday is always last day
      const isLastDayOfWeek = dayOfWeek === lastDayOfWeek;
      
      // Check if next day is in a different week or if this is the last day
      const isEndOfWeek = isLastDayOfWeek || index === days.length - 1 || 
        (index < days.length - 1 && getDayOfWeek(days[index + 1], displayOptions.weekStartsOnSunday) === 0);
      
      return {
        date: day,
        label: format(day, 'd'), // Day of month
        dayName: getSingleLetterDay(day), // Single letter day name
        monthLabel: format(day, 'MMM'), // Short month name
        isWeekend: isWeekendDay(day, displayOptions.weekStartsOnSunday),
        isSunday: isSunday(day),
        isFirstOfMonth: day.getDate() === 1,
        isEndOfWeek: isEndOfWeek
      };
    });
  }, [
    startDate, 
    periodToShow, 
    displayOptions.showWeekends, 
    displayOptions.selectedDays, 
    displayOptions.weekStartsOnSunday
  ]);
};
