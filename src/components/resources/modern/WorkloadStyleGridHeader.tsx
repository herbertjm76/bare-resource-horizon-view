
import React from 'react';
import { DayInfo } from '../grid/types';
import { format, isToday } from 'date-fns';

interface WorkloadStyleGridHeaderProps {
  days: DayInfo[];
}

export const WorkloadStyleGridHeader: React.FC<WorkloadStyleGridHeaderProps> = ({ days }) => {
  return (
    <thead className="workload-resource-grid-header">
      <tr>
        {/* Project/Resource column - Fixed width, sticky */}
        <th 
          className="workload-resource-header-cell project-column"
          style={{ 
            width: '250px',
            minWidth: '250px',
            maxWidth: '250px',
            position: 'sticky',
            left: '0px',
            zIndex: 30,
            backgroundColor: '#6465F0'
          }}
        >
          <div className="header-content">
            <span className="header-label">Project / Resource</span>
          </div>
        </th>
        
        {/* Day columns */}
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
              className="workload-resource-header-cell day-column"
              style={{ 
                width: '30px', 
                minWidth: '30px',
                maxWidth: '30px',
                height: '80px',
                backgroundColor,
                borderLeft: isFirstOfMonth ? '4px solid #fbbf24' : isNewMonth ? '2px solid #fbbf24' : undefined
              }}
            >
              <div className="header-content day-header">
                {isNewMonth && (
                  <div className="month-label">{format(day.date, 'MMM').toUpperCase()}</div>
                )}
                <div className="day-info">
                  <div className="day-name">{format(day.date, 'EEE').charAt(0)}</div>
                  <div className="day-number">{format(day.date, 'd')}</div>
                </div>
              </div>
            </th>
          );
        })}
      </tr>
    </thead>
  );
};
