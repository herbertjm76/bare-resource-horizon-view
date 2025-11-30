
import React from 'react';
import { DayInfo } from './types';
import { isToday } from 'date-fns';

interface GridDaysHeaderProps {
  days: DayInfo[];
}

export const GridDaysHeader: React.FC<GridDaysHeaderProps> = ({ days }) => {
  return (
    <tr>
      {/* Fixed counter column */}
      <th className="counter-column text-center">
        #
      </th>
      
      {/* Fixed project name column */}
      <th className="project-name-column text-left px-3">
        Project / Resource
      </th>
      
      {/* Day columns */}
      {days.map((day, index) => {
        const isWeekendDay = day.isWeekend;
        const isSundayDay = day.isSunday;
        const isFirstOfMonthDay = day.isFirstOfMonth;
        const isNewMonth = index === 0 || days[index - 1].monthLabel !== day.monthLabel;
        const isTodayDay = day.isToday;
        const isCurrentWeekDay = day.isCurrentWeek;
        
        const uniqueKey = `${day.date.toISOString().split('T')[0]}-${index}`;
        
        let headerClasses = 'day-column text-center text-xs font-semibold';
        
        if (isSundayDay) {
          headerClasses += ' border-l-2 border-yellow-300';
        }
        if (isFirstOfMonthDay) {
          headerClasses += ' border-l-4 border-orange-400';
        }
        if (isCurrentWeekDay) {
          headerClasses += ' current-week bg-blue-50 border-t-4 border-blue-500';
        }
        if (isTodayDay) {
          headerClasses += ' today ring-2 ring-blue-500 ring-inset bg-blue-100 font-bold';
        }
        
        return (
          <th 
            key={uniqueKey}
            className={headerClasses}
            style={{ 
              backgroundColor: 'transparent'
            }}
          >
            <div className="flex flex-col items-center h-full py-2">
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
    </tr>
  );
};
