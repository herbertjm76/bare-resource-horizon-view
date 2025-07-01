
import { useMemo } from 'react';

export const useGridTableWidth = (daysCount: number): number => {
  return useMemo(() => {
    // Fixed columns: counter (48px) + project name (200px)
    const fixedColumnsWidth = 48 + 200;
    // Day columns: 32px per day (matching the CSS day-column width)
    const daysColumnsWidth = daysCount * 32;
    // No buffer needed for exact width calculation
    
    // Calculate exact width needed without extra space
    const totalWidth = fixedColumnsWidth + daysColumnsWidth;
    
    return totalWidth;
  }, [daysCount]);
};
