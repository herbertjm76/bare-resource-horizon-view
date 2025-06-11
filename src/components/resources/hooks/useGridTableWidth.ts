
import { useMemo } from 'react';

export const useGridTableWidth = (daysCount: number): number => {
  return useMemo(() => {
    // Fixed columns: counter (48px) + project name (200px)
    const fixedColumnsWidth = 48 + 200;
    // Day columns: 30px per day (fixed width)
    const daysColumnsWidth = daysCount * 30;
    // Add padding for better spacing
    const totalWidth = fixedColumnsWidth + daysColumnsWidth + 40;
    
    // Ensure minimum width but allow expansion
    const minWidth = 1200;
    
    return Math.max(totalWidth, minWidth);
  }, [daysCount]);
};
