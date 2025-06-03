
import React from 'react';
import { DayInfo } from './types';

interface GridDaysHeaderProps {
  days: DayInfo[];
}

export const GridDaysHeader: React.FC<GridDaysHeaderProps> = ({ days }) => {
  return (
    <tr style={{ backgroundColor: '#6465F0' }}>
      {/* Fixed columns */}
      <th className="sticky-left-0 min-w-12 z-20 text-center text-white font-semibold py-3 px-3" style={{ backgroundColor: '#6465F0' }}>#</th>
      <th className="sticky-left-12 min-w-48 z-20 text-white font-semibold py-3 px-6" style={{ backgroundColor: '#6465F0' }}>Project / Resource</th>
      
      {/* Day columns */}
      {days.map((day) => {
        const isWeekendDay = day.isWeekend;
        const isSundayDay = day.isSunday;
        const isFirstOfMonthDay = day.isFirstOfMonth;
        
        return (
          <th 
            key={day.label} 
            className={`
              min-w-8 text-center text-xs font-semibold text-white py-3 px-2
              ${isSundayDay ? 'border-l-2 border-yellow-300' : ''}
              ${isFirstOfMonthDay ? 'border-l-4 border-orange-400' : ''}
            `}
            style={{ 
              width: '30px', 
              minWidth: '30px',
              backgroundColor: isWeekendDay ? '#5a5b8a' : '#6465F0'
            }}
          >
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] opacity-90 uppercase">
                {day.dayName}
              </span>
              <span className="text-sm font-bold">
                {day.label}
              </span>
            </div>
          </th>
        );
      })}
      
      {/* Flexible end column */}
      <th className="min-w-4" style={{ backgroundColor: '#6465F0' }}></th>
    </tr>
  );
};
