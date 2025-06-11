
import React from 'react';
import { DayInfo } from './types';

interface GridDaysHeaderProps {
  days: DayInfo[];
}

export const GridDaysHeader: React.FC<GridDaysHeaderProps> = ({ days }) => {
  return (
    <tr style={{ backgroundColor: '#6F4BF6' }}>
      {/* Fixed columns with enhanced styling */}
      <th className="sticky-left-0 min-w-15 z-20 text-center text-white font-semibold py-4 px-4" style={{ backgroundColor: '#6F4BF6', width: '60px' }}>
        <span className="text-sm">#</span>
      </th>
      <th className="sticky-left-15 min-w-62 z-20 text-white font-semibold py-4 px-6" style={{ backgroundColor: '#6F4BF6', width: '250px' }}>
        <span className="text-sm">Project / Resource</span>
      </th>
      
      {/* Day columns with enhanced responsive design */}
      {days.map((day, index) => {
        const isWeekendDay = day.isWeekend;
        const isSundayDay = day.isSunday;
        const isFirstOfMonthDay = day.isFirstOfMonth;
        const isNewMonth = index === 0 || days[index - 1].monthLabel !== day.monthLabel;
        
        // Create a unique key using date and index to avoid duplicates
        const uniqueKey = `${day.date.toISOString().split('T')[0]}-${index}`;
        
        // Determine column width based on total days (responsive to view)
        const columnWidth = days.length > 90 ? '35px' : days.length > 30 ? '40px' : '45px';
        
        return (
          <th 
            key={uniqueKey}
            className={`
              text-center text-xs font-semibold text-white py-3 px-1 relative transition-colors duration-200
              ${isSundayDay ? 'border-l-2 border-yellow-300' : ''}
              ${isFirstOfMonthDay ? 'border-l-4 border-orange-400' : ''}
              hover:bg-white/10
            `}
            style={{ 
              width: columnWidth, 
              minWidth: columnWidth,
              maxWidth: columnWidth,
              backgroundColor: isWeekendDay ? '#5a5b8a' : '#6F4BF6'
            }}
          >
            <div className="flex flex-col items-center h-full justify-center">
              {isNewMonth ? (
                <>
                  <span className="text-[9px] font-bold uppercase leading-none text-yellow-200 mb-1 tracking-wider">
                    {day.monthLabel}
                  </span>
                  <div className="flex flex-col items-center justify-center gap-0.5 flex-1">
                    <span className="text-[9px] opacity-90 uppercase leading-none font-medium tracking-wide">
                      {day.dayName}
                    </span>
                    <span className="text-sm font-bold leading-none">
                      {day.label}
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center gap-0.5 h-full">
                  <span className="text-[9px] opacity-90 uppercase leading-none font-medium tracking-wide">
                    {day.dayName}
                  </span>
                  <span className="text-sm font-bold leading-none">
                    {day.label}
                  </span>
                </div>
              )}
            </div>
            
            {/* Add subtle visual indicators */}
            {isFirstOfMonthDay && (
              <div className="absolute top-0 left-0 w-full h-1 bg-orange-400 opacity-60"></div>
            )}
            {isSundayDay && (
              <div className="absolute top-0 left-0 w-1 h-full bg-yellow-300 opacity-60"></div>
            )}
          </th>
        );
      })}
      
      {/* Flexible end column */}
      <th className="min-w-8 py-4" style={{ backgroundColor: '#6F4BF6', width: '40px' }}>
        <span className="sr-only">Actions</span>
      </th>
    </tr>
  );
};
