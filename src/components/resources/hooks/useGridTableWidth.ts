
import { useMemo } from 'react';

export const useGridTableWidth = (daysCount: number): number => {
  return useMemo(() => {
    // Fixed columns: counter (48px) + project name (200px)
    const fixedColumnsWidth = 48 + 200;
    // Day columns: 30px per day (fixed width)
    const daysColumnsWidth = daysCount * 30;
    // Add minimal padding but respect viewport constraints
    const totalWidth = fixedColumnsWidth + daysColumnsWidth + 20;
    
    // Don't exceed a reasonable maximum to prevent extreme horizontal scrolling
    const maxReasonableWidth = Math.max(800, window.innerWidth * 1.5);
    
    return Math.min(totalWidth, maxReasonableWidth);
  }, [daysCount]);
};
