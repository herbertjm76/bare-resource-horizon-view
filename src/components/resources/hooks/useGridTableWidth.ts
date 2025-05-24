
import { useMemo } from 'react';

export const useGridTableWidth = (daysCount: number): number => {
  return useMemo(() => {
    // Fixed columns: counter (60px) + project name (250px) - updated from previous values
    const fixedColumnsWidth = 60 + 250;
    // Day columns: 30px per day (fixed width)
    const daysColumnsWidth = daysCount * 30;
    // Add extra padding to ensure scrollbar always appears when needed
    const paddingBuffer = 100;
    return fixedColumnsWidth + daysColumnsWidth + paddingBuffer;
  }, [daysCount]);
};
