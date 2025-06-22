
import { format, startOfWeek, addWeeks } from 'date-fns';
import { WeekStartDate } from '../types/weeklyWorkloadTypes';

export const generateWeekStartDates = (
  selectedDate: Date,
  periodWeeks: number = 36
): WeekStartDate[] => {
  const weeks = [];
  const startWeek = startOfWeek(selectedDate, { weekStartsOn: 1 });
  
  for (let i = 0; i < periodWeeks; i++) {
    const weekStart = addWeeks(startWeek, i);
    weeks.push({
      date: weekStart,
      key: format(weekStart, 'yyyy-MM-dd')
    });
  }
  
  return weeks;
};
