
import { useMemo } from 'react';

export const useGridTableWidth = (daysCount: number): number => {
  return useMemo(() => {
    // Fixed columns: counter (60px) + project name (250px)
    const fixedColumnsWidth = 60 + 250;
    // Day columns: 45px per day (matching reduced CSS width)
    const daysColumnsWidth = daysCount * 45;
    // Add significant padding to force horizontal scroll - increased buffer
    const paddingBuffer = 800; // Increased from 400 to ensure scrolling
    const totalWidth = fixedColumnsWidth + daysColumnsWidth + paddingBuffer;
    
    console.log('Table width calculation:', {
      daysCount,
      fixedColumnsWidth,
      daysColumnsWidth,
      paddingBuffer,
      totalWidth,
      windowWidth: window.innerWidth
    });
    
    return totalWidth;
  }, [daysCount]);
};
