
import React from 'react';
import { DayInfo } from './types';
import { isToday } from 'date-fns';

interface GridDaysHeaderProps {
  days: DayInfo[];
}

export const GridDaysHeader: React.FC<GridDaysHeaderProps> = ({ days }) => {
  return (
    <tr style={{ backgroundColor: '#6465F0' }}>
      {/* Fixed counter column */}
      <th className="counter-column text-center text-white font-semibold py-3 px-1" style={{ backgroundColor: '#6465F0' }}>
        #
      </th>
      
      {/* Fixed project name column */}
      <th className="project-name-column text-white font-semibold py-3 px-3" style={{ backgroundColor: '#6465F0' }}>
        Project / Resource
      </th>
      
      {/* Day columns */}
      {days.map((day, index) => {
        const isWeekendDay = day.isWeekend;
        const isSundayDay = day.isSunday;
        const isFirstOfMonthDay = day.isFirstOfMonth;
        const isNewMonth = index === 0 || days[index - 1].monthLabel !== day.monthLabel;
        const isTodayDay = isToday(day.date);
        
        // Create a unique key using date and index to avoid duplicates
        const uniqueKey = `${day.date.toISOString().split('T')[0]}-${index}`;
        
        // Determine background color based on day type
        let backgroundColor = '#6465F0'; // Default
        if (isTodayDay) {
          backgroundColor = '#a855f7'; // Light purple for current day
        } else if (isWeekendDay) {
          backgroundColor = '#5a5b8a'; // Weekend color
        }
        
        return (
          <th 
            key={uniqueKey}
            className={`
              day-column text-center text-xs font-semibold text-white py-2 px-1 relative
              ${isSundayDay ? 'border-l-2 border-yellow-300' : ''}
              ${isFirstOfMonthDay ? 'border-l-4 border-orange-400' : ''}
              ${isTodayDay ? 'ring-2 ring-purple-300 ring-inset' : ''}
            `}
            style={{ backgroundColor: backgroundColor }}
          >
            <div className="flex flex-col items-center h-full">
              {isNewMonth ? (
                <>
                  <span className="text-[10px] font-bold uppercase leading-none text-yellow-200 mb-1">
                    {day.monthLabel}
                  </span>
                  <div className="flex flex-col items-center justify-end gap-0.5 flex-1">
                    <span className="text-[10px] opacity-90 uppercase leading-none font-medium">
                      {day.dayName}
                    </span>
                    <span className="text-sm font-bold leading-none">
                      {day.label}
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-end gap-0.5 h-full pt-4">
                  <span className="text-[10px] opacity-90 uppercase leading-none font-medium">
                    {day.dayName}
                  </span>
                  <span className="text-sm font-bold leading-none">
                    {day.label}
                  </span>
                </div>
              )}
            </div>
          </th>
        );
      })}
      
      {/* Flexible end column */}
      <th className="min-w-4" style={{ backgroundColor: '#6465F0' }}></th>
    </tr>
  );
};
