
import { format, parseISO } from 'date-fns';

/**
 * Format date to yyyy-MM-dd for database consistency
 */
export const formatDateKey = (dateStr: string): string => {
  try {
    return format(parseISO(dateStr), 'yyyy-MM-dd');
  } catch (e) {
    console.error('Error formatting date:', dateStr, e);
    return dateStr;
  }
};
