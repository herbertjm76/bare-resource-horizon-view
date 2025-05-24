
import React from 'react';
import { format, isSunday, isFirstDayOfMonth } from 'date-fns';

interface DayInfo {
  date: Date;
  label: string;
  dayName: string;
  monthLabel: string;
  isWeekend: boolean;
  isSunday: boolean;
  isFirstOfMonth: boolean;
}

interface GridDaysHeaderProps {
  days: DayInfo[];
}

export const GridDaysHeader: React.FC<GridDaysHeaderProps> = ({ days }) => {
  return (
    <tr>
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
        const isWeekendClass = day.isWeekend ? 'bg-muted/40' : '';
        const isSundayClass = day.isSunday ? 'sunday-border' : '';
        const isFirstOfMonthClass = day.isFirstOfMonth ? 'border-l-2 border-l-brand-primary/40' : '';
        
        return (
          <th 
            key={i}
            style={{
              width: '30px',
              minWidth: '30px'
            }} 
            className={`border-b text-center font-medium ${isWeekendClass} ${isSundayClass} ${isFirstOfMonthClass}`}
          >
            <div className="date-label flex flex-col items-center">
              {/* Add month label for first of month */}
              {day.isFirstOfMonth && (
                <span className="text-[10px] text-muted-foreground">
                  {day.monthLabel}
                </span>
              )}
              
              {/* Always show day number */}
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
  );
};
