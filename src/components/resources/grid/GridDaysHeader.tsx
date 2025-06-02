
import React from 'react';
import { format, isWeekend, getDay } from 'date-fns';
import { DayInfo } from './types';

interface GridDaysHeaderProps {
  days: DayInfo[];
}

export const GridDaysHeader: React.FC<GridDaysHeaderProps> = ({ days }) => {
  return (
    <tr>
      {/* Fixed columns */}
      <th className="sticky-left-0 min-w-12 bg-inherit z-20 text-center">#</th>
      <th className="sticky-left-12 min-w-48 bg-inherit z-20">Project / Resource</th>
      
      {/* Day columns */}
      {days.map((day) => {
        const isWeekendDay = day.isWeekend;
        const isSundayDay = day.isSunday;
        const isFirstOfMonthDay = day.isFirstOfMonth;
        
        return (
          <th 
            key={day.label} 
            className={`
              min-w-8 text-center text-xs font-semibold
              ${isWeekendDay ? 'weekend' : ''}
              ${isSundayDay ? 'sunday-border' : ''}
              ${isFirstOfMonthDay ? 'month-start' : ''}
            `}
            style={{ width: '30px', minWidth: '30px' }}
          >
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] opacity-75">
                {day.dayName}
              </span>
              <span className="text-sm font-bold">{day.label}</span>
            </div>
          </th>
        );
      })}
      
      {/* Flexible end column */}
      <th className="min-w-4"></th>
    </tr>
  );
};
