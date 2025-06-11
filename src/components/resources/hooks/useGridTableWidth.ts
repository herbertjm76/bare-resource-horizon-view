
import { useMemo } from 'react';

export const useGridTableWidth = (daysCount: number): number => {
  return useMemo(() => {
    // Fixed columns: counter (60px) + project name (250px) 
    const fixedColumnsWidth = 60 + 250;
    
    // Dynamic day column width based on number of days
    let dayColumnWidth = 40; // Base width for day columns
    
    // Adjust column width based on the number of days for better UX
    if (daysCount > 90) { // 12 months view
      dayColumnWidth = 35;
    } else if (daysCount > 30) { // 3 months view
      dayColumnWidth = 40;
    } else { // 1 month view
      dayColumnWidth = 45;
    }
    
    // Day columns: calculated width per day
    const daysColumnsWidth = daysCount * dayColumnWidth;
    
    // Add padding and flexible end column
    const paddingAndFlexible = 80;
    
    const totalWidth = fixedColumnsWidth + daysColumnsWidth + paddingAndFlexible;
    
    // Ensure minimum width for usability
    const minWidth = 1000;
    
    console.log(`Grid width calculation: ${daysCount} days, ${dayColumnWidth}px per day, total: ${totalWidth}px`);
    
    return Math.max(totalWidth, minWidth);
  }, [daysCount]);
};
