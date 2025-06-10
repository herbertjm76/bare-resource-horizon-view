
import React from 'react';
import { DayInfo } from './types';

interface GridDaysHeaderProps {
  days: DayInfo[];
}

export const GridDaysHeader: React.FC<GridDaysHeaderProps> = ({ days }) => {
  return (
    <>
      {/* Month labels row - outside the table */}
      <div className="flex" style={{ marginLeft: '260px' }}> {/* Offset for fixed columns */}
        {days.map((day, index) => {
          const isNewMonth = index === 0 || days[index - 1].monthLabel !== day.monthLabel;
          
          if (!isNewMonth) return <div key={`spacer-${index}`} style={{ width: '30px', minWidth: '30px' }}></div>;
          
          // Calculate how many days this month spans
          let monthSpan = 1;
          for (let i = index + 1; i < days.length && days[i].monthLabel === day.monthLabel; i++) {
            monthSpan++;
          }
          
          return (
            <div 
              key={`month-${day.monthLabel}-${index}`}
              className="text-center text-white font-bold text-sm py-1"
              style={{ 
                width: `${monthSpan * 30}px`,
                minWidth: `${monthSpan * 30}px`,
                backgroundColor: '#6465F0'
              }}
            >
              {day.monthLabel}
            </div>
          );
        })}
      </div>
      
      {/* Regular table header */}
      <tr style={{ backgroundColor: '#6465F0' }}>
        {/* Fixed columns */}
        <th className="sticky-left-0 min-w-12 z-20 text-center text-white font-semibold py-3 px-3" style={{ backgroundColor: '#6465F0' }}>#</th>
        <th className="sticky-left-12 min-w-48 z-20 text-white font-semibold py-3 px-6" style={{ backgroundColor: '#6465F0' }}>Project / Resource</th>
        
        {/* Day columns */}
        {days.map((day, index) => {
          const isWeekendDay = day.isWeekend;
          const isSundayDay = day.isSunday;
          const isFirstOfMonthDay = day.isFirstOfMonth;
          
          return (
            <th 
              key={day.label} 
              className={`
                min-w-8 text-center text-xs font-semibold text-white py-3 px-2 relative
                ${isSundayDay ? 'border-l-2 border-yellow-300' : ''}
                ${isFirstOfMonthDay ? 'border-l-4 border-orange-400' : ''}
              `}
              style={{ 
                width: '30px', 
                minWidth: '30px',
                backgroundColor: isWeekendDay ? '#5a5b8a' : '#6465F0'
              }}
            >
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-[9px] opacity-90 uppercase leading-none">
                  {day.dayName}
                </span>
                <span className="text-sm font-bold leading-none">
                  {day.label}
                </span>
              </div>
            </th>
          );
        })}
        
        {/* Flexible end column */}
        <th className="min-w-4" style={{ backgroundColor: '#6465F0' }}></th>
      </tr>
    </>
  );
};
