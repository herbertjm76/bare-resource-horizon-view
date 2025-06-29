
import React from 'react';
import { format } from 'date-fns';

interface WorkloadCalendarHeaderProps {
  weekStartDates: Array<{ date: Date; key: string }>;
}

export const WorkloadCalendarHeader: React.FC<WorkloadCalendarHeaderProps> = ({
  weekStartDates
}) => {
  return (
    <thead>
      <tr style={{ backgroundColor: '#6465F0' }}>
        {/* Team Member column */}
        <th 
          className="workload-grid-header member-column sticky-left-0 z-20"
          style={{ backgroundColor: '#6465F0' }}
        >
          Team Member
        </th>
        
        {/* Week columns - matching Project Resourcing format */}
        {weekStartDates.map((week, index) => {
          const isFirstOfMonth = week.date.getDate() <= 7;
          const isNewMonth = index === 0 || weekStartDates[index - 1].date.getMonth() !== week.date.getMonth();
          
          return (
            <th 
              key={week.key}
              className="workload-grid-header week-column text-center text-xs font-semibold text-white py-2 px-1 relative"
              style={{ 
                width: '30px', 
                minWidth: '30px',
                backgroundColor: '#6465F0',
                borderLeft: isFirstOfMonth ? '4px solid #fbbf24' : isNewMonth ? '2px solid #fbbf24' : undefined
              }}
            >
              <div className="flex flex-col items-center h-full">
                {isNewMonth ? (
                  <>
                    <span className="text-[10px] font-bold uppercase leading-none text-yellow-200 mb-1">
                      {format(week.date, 'MMM')}
                    </span>
                    <div className="flex flex-col items-center justify-end gap-0.5 flex-1">
                      <span className="text-[10px] opacity-90 uppercase leading-none font-medium">
                        W
                      </span>
                      <span className="text-sm font-bold leading-none">
                        {format(week.date, 'd')}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-end gap-0.5 h-full pt-4">
                    <span className="text-[10px] opacity-90 uppercase leading-none font-medium">
                      W
                    </span>
                    <span className="text-sm font-bold leading-none">
                      {format(week.date, 'd')}
                    </span>
                  </div>
                )}
              </div>
            </th>
          );
        })}
        
        {/* Total Utilization column */}
        <th 
          className="workload-grid-header total-column"
          style={{ backgroundColor: '#7c3aed' }}
        >
          Total Utilization
        </th>
      </tr>
    </thead>
  );
};
