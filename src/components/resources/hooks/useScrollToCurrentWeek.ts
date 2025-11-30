import { useEffect } from 'react';
import { isToday, startOfWeek } from 'date-fns';
import { DayInfo } from '../grid/types';

/**
 * Hook to automatically scroll to the current week on component mount
 */
export const useScrollToCurrentWeek = (
  days: DayInfo[],
  containerRef: React.RefObject<HTMLDivElement>
) => {
  useEffect(() => {
    if (!containerRef.current || days.length === 0) return;

    // Find the index of today in the days array
    const todayIndex = days.findIndex(day => day.isToday);
    
    if (todayIndex === -1) return;

    // Calculate scroll position
    // Assuming each day column is 32px wide (from CSS)
    const dayColumnWidth = 32;
    const fixedColumnsWidth = 48 + 200; // counter + project name
    const scrollPosition = (todayIndex * dayColumnWidth) - (containerRef.current.clientWidth / 2) + fixedColumnsWidth;

    // Scroll to position smoothly
    setTimeout(() => {
      containerRef.current?.scrollTo({
        left: Math.max(0, scrollPosition),
        behavior: 'smooth'
      });
    }, 100);
  }, [days, containerRef]);
};
