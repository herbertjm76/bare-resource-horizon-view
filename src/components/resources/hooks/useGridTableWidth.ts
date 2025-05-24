
import { useMemo } from 'react';

export const useGridTableWidth = (daysCount: number): number => {
  return useMemo(() => {
    // Fixed columns: counter (60px) + project name (250px) - updated from previous values
    const fixedColumnsWidth = 60 + 250;
    // Day columns: 72px per day (matching CSS min-width)
    const daysColumnsWidth = daysCount * 72;
    // Add significant padding to force horizontal scroll
    const paddingBuffer = 400;
    const totalWidth = fixedColumnsWidth + daysColumnsWidth + paddingBuffer;
    
    console.log('Table width calculation:', {
      daysCount,
      fixedColumnsWidth,
      daysColumnsWidth,
      paddingBuffer,
      totalWidth
    });
    
    return totalWidth;
  }, [daysCount]);
};
