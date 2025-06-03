
import { useState, useEffect } from 'react';
import { DateFormat } from '../types';
import { STORAGE_KEY } from '../constants';

export const useFormatSelection = (defaultFormat: DateFormat) => {
  const [selectedFormat, setSelectedFormat] = useState<DateFormat>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      return (saved as DateFormat) || defaultFormat;
    }
    return defaultFormat;
  });

  // Save format preference to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, selectedFormat);
    }
  }, [selectedFormat]);

  return { selectedFormat, setSelectedFormat };
};
