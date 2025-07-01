
import { useMemo } from 'react';

export const useGridTableWidth = (daysCount: number): number => {
  return useMemo(() => {
    // Fixed columns: counter (48px) + project name (200px)
    const fixedColumnsWidth = 48 + 200;
    // Day columns: 32px per day (matching the CSS day-column width)
    const daysColumnsWidth = daysCount * 32;
    // Small buffer for borders and spacing
    const buffer = 20;
    
    // Calculate exact width needed
    const totalWidth = fixedColumnsWidth + daysColumnsWidth + buffer;
    
    return totalWidth;
  }, [daysCount]);
};
