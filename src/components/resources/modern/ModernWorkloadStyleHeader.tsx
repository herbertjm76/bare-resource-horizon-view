
import React from 'react';
import { DayInfo } from '../grid/types';
import { format, isToday } from 'date-fns';

interface ModernWorkloadStyleHeaderProps {
  days: DayInfo[];
}

export const ModernWorkloadStyleHeader: React.FC<ModernWorkloadStyleHeaderProps> = ({ days }) => {
  return (
    <thead>
      <tr style={{ backgroundColor: '#6465F0' }}>
        {/* Project column - Fixed width, sticky */}
        <th 
          className="workload-grid-header member-column sticky-left-0 z-20"
          style={{ 
            backgroundColor: '#6465F0',
            width: '250px',
            minWidth: '250px',
            maxWidth: '250px',
            position: 'sticky',
            left: '0px',
            zIndex: 30
          }}
        >
          Project / Resource
        </th>
        
        {/* Day columns - Fixed width matching Team Workload format */}
        {days.map((day, index) => {
          const isTodayDay = isToday(day.date);
          const isFirstOfMonth = day.date.getDate() <= 7;
          const isNewMonth = index === 0 || days[index - 1].date.getMonth() !== day.date.getMonth();
          
          let backgroundColor = '#6465F0';
          if (isTodayDay) {
            backgroundColor = '#f6ad55';
          } else if (day.isWeekend) {
            backgroundColor = '#4a5568';
          }
          
          return (
            <th 
              key={`${day.date.toISOString()}-${index}`}
              className="workload-grid-header week-column text-center text-xs font-semibold text-white py-2 px-1 relative"
              style={{ 
                width: '30px', 
                minWidth: '30px',
                maxWidth: '30px',
                backgroundColor,
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
                        {format(day.date, 'EEE').charAt(0)}
                      </span>
                      <span className="text-sm font-bold leading-none">
                        {format(day.date, 'd')}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-end gap-0.5 h-full pt-4">
                    <span className="text-[10px] opacity-90 uppercase leading-none font-medium">
                      {format(day.date, 'EEE').charAt(0)}
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
    </thead>
  );
};
