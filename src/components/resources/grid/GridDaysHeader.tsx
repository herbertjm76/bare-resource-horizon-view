
import React from 'react';
import { format } from 'date-fns';

interface DayInfo {
  date: Date;
  label: string;
  dayName: string;
  monthLabel: string;
  isWeekend: boolean;
  isSunday: boolean;
  isFirstOfMonth: boolean;
  isEndOfWeek?: boolean;
}

interface GridDaysHeaderProps {
  days: DayInfo[];
}

export const GridDaysHeader: React.FC<GridDaysHeaderProps> = ({ days }) => {
  return (
    <tr style={{ backgroundColor: '#6465F0' }}>
      {/* Project/Resource column - Fixed width */}
      <th 
        className="sticky-left-0 z-20 text-left font-semibold text-white py-3 px-4 border-r-2 border-gray-300"
        style={{ 
          backgroundColor: '#6465F0',
          width: '250px',
          minWidth: '250px',
          maxWidth: '250px'
        }}
      >
        Project / Resource
      </th>
      
      {/* Day columns - Fixed width */}
      {days.map((day, index) => {
        const isFirstOfMonth = day.isFirstOfMonth;
        const isNewMonth = index === 0 || days[index - 1]?.date.getMonth() !== day.date.getMonth();
        
        return (
          <th 
            key={day.label}
            className="text-center text-xs font-semibold text-white py-2 px-1 relative"
            style={{ 
              width: '30px', 
              minWidth: '30px',
              maxWidth: '30px',
              backgroundColor: '#6465F0',
              borderLeft: isFirstOfMonth ? '4px solid #fbbf24' : isNewMonth ? '2px solid #fbbf24' : undefined
            }}
          >
            <div className="flex flex-col items-center h-full">
              {isNewMonth ? (
                <>
                  <span className="text-[10px] font-bold uppercase leading-none text-yellow-200 mb-1">
                    {format(day.date, 'MMM')}
                  </span>
                  <div className="flex flex-col items-center justify-end gap-0.5 flex-1">
                    <span className="text-[10px] opacity-90 uppercase leading-none font-medium">
                      {day.dayName}
                    </span>
                    <span className="text-sm font-bold leading-none">
                      {format(day.date, 'd')}
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-end gap-0.5 h-full pt-4">
                  <span className="text-[10px] opacity-90 uppercase leading-none font-medium">
                    {day.dayName}
                  </span>
                  <span className="text-sm font-bold leading-none">
                    {format(day.date, 'd')}
                  </span>
                </div>
              )}
            </div>
          </th>
        );
      })}
    </tr>
  );
};
