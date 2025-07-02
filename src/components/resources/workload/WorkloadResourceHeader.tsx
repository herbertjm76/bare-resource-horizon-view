
import React from 'react';
import { DayInfo } from '../grid/types';
import { isToday } from 'date-fns';

interface WorkloadResourceHeaderProps {
  days: DayInfo[];
}

export const WorkloadResourceHeader: React.FC<WorkloadResourceHeaderProps> = ({ days }) => {
  return (
    <thead>
      <tr style={{ backgroundColor: '#6465F0' }}>
        {/* Project column - matching workload style exactly */}
        <th 
          className="workload-grid-header member-column sticky-left-0 z-20"
          style={{ 
            backgroundColor: '#6465F0',
            width: '250px',
            minWidth: '250px',
            maxWidth: '250px'
          }}
        >
          Project / Resource
        </th>
        
        {/* Day columns - matching workload header style exactly */}
        {days.map((day, index) => {
          const isTodayDay = isToday(day.date);
          const isNewMonth = index === 0 || days[index - 1].monthLabel !== day.monthLabel;
          
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
                borderLeft: day.isFirstOfMonth ? '4px solid #fbbf24' : isNewMonth ? '2px solid #fbbf24' : undefined
              }}
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
      </tr>
    </thead>
  );
};
