
import { toUTCDateKey, parseUTCDateKey } from '@/utils/dateKey';

/**
 * Format a date key to ensure consistent format (UTC-safe)
 * 
 * @param dateKey String date in any format
 * @returns Formatted date in YYYY-MM-DD format (UTC)
 */
export const formatDateKey = (dateKey: string): string => {
  try {
    // If already in correct format, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) {
      return dateKey;
    }
    
    // Parse as UTC and format using UTC date key
    const date = parseUTCDateKey(dateKey.split('T')[0]);
    return toUTCDateKey(date);
  } catch (error) {
    console.error('Error formatting date key:', dateKey, error);
    return dateKey;
  }
};

/**
 * Calculate total allocation hours from a collection
 * 
 * @param allocations Record of allocations
 * @returns Total hours
 */
export const calculateTotalHours = (allocations: Record<string, number>): number => {
  return Object.values(allocations).reduce((total, hours) => total + hours, 0);
};

/**
 * Format hours to display with 1 decimal place if needed
 * 
 * @param hours Number of hours
 * @returns Formatted string
 */
export const formatHours = (hours: number): string => {
  if (Math.floor(hours) === hours) {
    return hours.toString();
  }
  return hours.toFixed(1);
};
