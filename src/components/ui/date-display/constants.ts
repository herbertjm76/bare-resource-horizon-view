
import { DateFormatOption } from './types';

export const createFormatOptions = (): DateFormatOption[] => {
  const now = new Date();
  return [
    {
      key: 'short',
      label: 'Short Date',
      example: now.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      })
    },
    {
      key: 'long',
      label: 'Long Date',
      example: now.toLocaleDateString('en-US', { 
        weekday: 'long',
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      })
    },
    {
      key: 'numeric',
      label: 'Numeric',
      example: now.toLocaleDateString('en-US')
    },
    {
      key: 'relative',
      label: 'Relative',
      example: 'Today'
    },
    {
      key: 'time',
      label: 'Date & Time',
      example: now.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      })
    }
  ];
};

export const STORAGE_KEY = 'date-display-format';
