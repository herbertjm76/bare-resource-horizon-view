
import { useMemo } from 'react';
import { DateFormat } from '../types';

export const useDateDisplay = (selectedFormat: DateFormat) => {
  // Get current date and timezone
  const currentDate = useMemo(() => new Date(), []);
  const timezone = useMemo(() => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }, []);

  // Format the current date based on selected format
  const formattedDate = useMemo(() => {
    switch (selectedFormat) {
      case 'short':
        return currentDate.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        });
      case 'long':
        return currentDate.toLocaleDateString('en-US', { 
          weekday: 'long',
          month: 'long', 
          day: 'numeric', 
          year: 'numeric' 
        });
      case 'numeric':
        return currentDate.toLocaleDateString('en-US');
      case 'relative':
        return 'Today';
      case 'time':
        return currentDate.toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit'
        });
      default:
        return currentDate.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        });
    }
  }, [currentDate, selectedFormat]);

  return { currentDate, timezone, formattedDate };
};
