
import { useMemo } from 'react';
import { format, addDays, isWeekend, isSunday, startOfMonth, eachDayOfInterval, addWeeks } from 'date-fns';
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

export const useGridDays = (
  startDate: Date,
  periodToShow: number,
  displayOptions: DisplayOptions
): DayInfo[] => {
  return useMemo(() => {
    const monthStart = startOfMonth(startDate);
    
    // Convert periodToShow from weeks to days for eachDayOfInterval
    // Using 7 days per week to ensure full weeks are shown
    const daysToAdd = periodToShow * 7;
    const endDate = addDays(monthStart, daysToAdd - 1);
    
    let allDays = eachDayOfInterval({
      start: monthStart,
      end: endDate
    });
    
    // Filter days based on display options
    allDays = allDays.filter(day => {
      // Get the day ID for the current date (e.g., 'mon', 'tue', etc.)
      const dayOfWeek = getDayOfWeek(day, displayOptions.weekStartsOnSunday);
      const dayId = dayOfWeekToId(dayOfWeek, displayOptions.weekStartsOnSunday);
      
      // Weekend handling - ensure weekends are shown if showWeekends is true
      // This should override the selectedDays filter for weekend days
      if (isWeekend(day)) {
        return displayOptions.showWeekends && displayOptions.selectedDays.includes(dayId);
      }
      
      // For non-weekend days, check if they are in the selectedDays list
      return displayOptions.selectedDays.includes(dayId);
    });
    
    return allDays.map((day, index, days) => {
      const dayOfWeek = getDayOfWeek(day, displayOptions.weekStartsOnSunday);
      const isLastDayOfWeek = dayOfWeek === (displayOptions.weekStartsOnSunday ? 6 : 6);
      
      // Check if next day is in a different week or if this is the last day
      const isEndOfWeek = isLastDayOfWeek || index === days.length - 1 || 
        (index < days.length - 1 && getDayOfWeek(days[index + 1], displayOptions.weekStartsOnSunday) === 0);
      
      return {
        date: day,
        label: format(day, 'd'), // Day of month
        dayName: getSingleLetterDay(day), // Single letter day name
        monthLabel: format(day, 'MMM'), // Short month name
        isWeekend: isWeekend(day),
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
