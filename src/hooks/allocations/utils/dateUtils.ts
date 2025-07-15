
import { format, startOfWeek } from 'date-fns';

/**
 * Gets the Monday of the selected week
 */
export function getWeekStartDate(date: Date): Date {
  return startOfWeek(date, { weekStartsOn: 1 }); // 1 = Monday
}

/**
 * Gets both Monday and Sunday dates for the selected week
 * to handle databases that might use either as week start
 */
export function getWeekStartOptions(selectedWeek: Date) {
  // Get the Monday of the selected week
  const monday = getWeekStartDate(selectedWeek);
  
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
export function getWeekDateRange(selectedWeek: Date) {
  const startDate = getWeekStartDate(selectedWeek);
  
  // End date is 6 days after start (full week)
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);
  
  const startDateString = format(startDate, 'yyyy-MM-dd');
  const endDateString = format(endDate, 'yyyy-MM-dd');
  
  return { startDate, endDate, startDateString, endDateString };
}
