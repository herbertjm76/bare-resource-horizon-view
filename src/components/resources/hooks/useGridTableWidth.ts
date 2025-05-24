
import { useMemo } from 'react';

export const useGridTableWidth = (daysCount: number): number => {
  return useMemo(() => {
    // Fixed columns: counter (48px) + project name (200px)
    const fixedColumnsWidth = 48 + 200;
    // Day columns: 30px per day (fixed width)
    const daysColumnsWidth = daysCount * 30;
    // Add padding to ensure we have enough space
    return fixedColumnsWidth + daysColumnsWidth + 50;
  }, [daysCount]);
};
