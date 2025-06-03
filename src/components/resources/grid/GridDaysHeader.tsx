
import React from 'react';
import { format, isWeekend, getDay } from 'date-fns';
import { DayInfo } from './types';

interface GridDaysHeaderProps {
  days: DayInfo[];
}

export const GridDaysHeader: React.FC<GridDaysHeaderProps> = ({ days }) => {
  return (
    <tr className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
      {/* Fixed columns */}
      <th className="sticky-left-0 min-w-12 bg-gradient-to-r from-indigo-600 to-purple-600 z-20 text-center text-white font-semibold py-4 px-3 shadow-lg">#</th>
      <th className="sticky-left-12 min-w-48 bg-gradient-to-r from-purple-600 to-pink-600 z-20 text-white font-semibold py-4 px-6 shadow-lg">Project / Resource</th>
      
      {/* Day columns */}
      {days.map((day) => {
        const isWeekendDay = day.isWeekend;
        const isSundayDay = day.isSunday;
        const isFirstOfMonthDay = day.isFirstOfMonth;
        
        return (
          <th 
            key={day.label} 
            className={`
              min-w-8 text-center text-xs font-bold text-white py-4 px-2 relative
              ${isWeekendDay ? 'bg-gradient-to-b from-gray-500 to-gray-600' : 'bg-gradient-to-b from-indigo-600 to-purple-600'}
              ${isSundayDay ? 'border-l-2 border-yellow-300' : ''}
              ${isFirstOfMonthDay ? 'border-l-4 border-orange-400' : ''}
              shadow-md
            `}
            style={{ width: '30px', minWidth: '30px' }}
          >
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] opacity-90 uppercase tracking-wider">
                {day.dayName}
              </span>
              <span className="text-sm font-bold bg-white/20 px-2 py-1 rounded-lg backdrop-blur-sm">
                {day.label}
              </span>
            </div>
          </th>
        );
      })}
      
      {/* Flexible end column */}
      <th className="min-w-4 bg-gradient-to-r from-pink-600 to-rose-600"></th>
    </tr>
  );
};
