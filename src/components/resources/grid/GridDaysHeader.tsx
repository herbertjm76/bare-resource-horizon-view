import React from 'react';
import { format, isSunday, isFirstDayOfMonth } from 'date-fns';
import { DayInfo } from './types';

interface GridDaysHeaderProps {
  days: DayInfo[];
}

export const GridDaysHeader: React.FC<GridDaysHeaderProps> = ({ days }) => {
  // Group days by month for month headers
  const monthGroups: { month: string, startIndex: number, colSpan: number }[] = [];
  let currentMonth = '';
  let startIndex = -1;
  
  days.forEach((day, index) => {
    const monthYear = format(day.date, 'MMM yyyy');
    
    if (monthYear !== currentMonth) {
      // End previous group if exists
      if (currentMonth !== '') {
        monthGroups.push({
          month: currentMonth,
          startIndex,
          colSpan: index - startIndex
        });
      }
      
      // Start new group
      currentMonth = monthYear;
      startIndex = index;
    }
    
    // Handle last group when reaching the end
    if (index === days.length - 1) {
      monthGroups.push({
        month: currentMonth,
        startIndex,
        colSpan: days.length - startIndex
      });
    }
  });
  
  return (
    <>
      {/* Month headers row */}
      <tr className="bg-gray-50/70">
        {/* Empty cells for the frozen columns */}
        <th className="sticky-left-0 bg-muted/50 z-30 border-b border-r"></th>
        <th className="sticky-left-12 bg-muted/50 z-30 border-b border-r"></th>
        
        {/* Month headers */}
        {monthGroups.map((group, idx) => (
          <th 
            key={`month-${idx}`}
            colSpan={group.colSpan}
            className="text-xs font-medium text-center border-b text-muted-foreground py-1"
          >
            {group.month}
          </th>
        ))}
        
        {/* Empty cell for the flexible column */}
        <th className="border-b"></th>
      </tr>
    
      {/* Day headers row */}
      <tr className="bg-gray-50/70">
        {/* Resources count column - frozen */}
        <th 
          className="sticky-left-0 bg-muted/50 z-30 border-b text-center font-medium w-12 shadow-[1px_0_0_0_#e5e7eb]" 
          style={{
            width: '48px',
            minWidth: '48px'
          }}
        >
          {/* Empty header for the counter column */}
        </th>
        
        {/* Project/Resource column - frozen */}
        <th 
          className="sticky-left-12 bg-muted/50 z-30 border-b text-left font-medium shadow-[1px_0_0_0_#e5e7eb]" 
          style={{
            width: '200px',
            minWidth: '200px'
          }}
        >
          Project / Resource
        </th>
        
        {/* Date columns - fixed width columns */}
        {days.map((day, i) => {
          const isWeekendClass = day.isWeekend ? 'weekend' : '';
          const isSundayClass = day.isSunday ? 'sunday-border' : '';
          const isFirstOfMonthClass = day.isFirstOfMonth ? 'border-l-2 border-l-brand-primary/40' : '';
          const isEndOfWeekClass = day.isEndOfWeek ? 'border-r border-r-gray-300' : '';
          
          return (
            <th 
              key={i}
              style={{
                width: '30px',
                minWidth: '30px'
              }} 
              className={`border-b text-center font-medium ${isWeekendClass} ${isSundayClass} ${isFirstOfMonthClass} ${isEndOfWeekClass}`}
            >
              <div className="date-label flex flex-col items-center">
                {/* Day number */}
                <span className="text-xs font-medium">
                  {day.label}
                </span>
                
                {/* Day of week abbreviation */}
                <span className="text-[10px] text-muted-foreground">
                  {day.dayName.charAt(0)}
                </span>
              </div>
            </th>
          );
        })}
        
        {/* Blank flexible column */}
        <th className="border-b text-center font-medium">
          {/* Empty space to allow horizontal scrolling */}
        </th>
      </tr>
    </>
  );
};
