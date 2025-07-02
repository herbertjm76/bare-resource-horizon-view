
import React from 'react';
import { DayInfo } from '../grid/types';
import { isToday } from 'date-fns';

interface ModernTableHeaderProps {
  days: DayInfo[];
}

export const ModernTableHeader: React.FC<ModernTableHeaderProps> = ({ days }) => {
  return (
    <thead className="modern-table-header">
      <tr>
        {/* Control column - matching workload style exactly */}
        <th 
          className="modern-header-cell control-column"
          style={{ 
            width: '60px',
            minWidth: '60px',
            maxWidth: '60px'
          }}
        >
          <div className="header-content">
            <span className="header-label">View</span>
          </div>
        </th>
        
        {/* Project column - matching workload style exactly */}
        <th 
          className="modern-header-cell project-column"
          style={{ 
            width: '250px',
            minWidth: '250px',
            maxWidth: '250px'
          }}
        >
          <div className="header-content">
            <span className="header-label">Project / Resource</span>
          </div>
        </th>
        
        {/* Day columns - matching workload header style exactly */}
        {days.map((day, index) => {
          const isTodayDay = isToday(day.date);
          const isNewMonth = index === 0 || days[index - 1].monthLabel !== day.monthLabel;
          
          let headerClasses = 'modern-header-cell day-column';
          let backgroundColor = '#6465F0';
          
          if (isTodayDay) {
            headerClasses += ' today';
            backgroundColor = '#f6ad55';
          } else if (day.isWeekend) {
            headerClasses += ' weekend';
            backgroundColor = '#4a5568';
          }
          
          if (day.isSunday) headerClasses += ' sunday';
          if (day.isFirstOfMonth) headerClasses += ' month-start';
          
          return (
            <th 
              key={`${day.date.toISOString()}-${index}`} 
              className={headerClasses}
              style={{ 
                width: '30px', 
                minWidth: '30px',
                maxWidth: '30px',
                height: '80px',
                backgroundColor,
                borderLeft: day.isFirstOfMonth ? '4px solid #fbbf24' : isNewMonth ? '2px solid #fbbf24' : undefined
              }}
            >
              <div className="header-content day-header">
                {isNewMonth && (
                  <div className="month-label">{day.monthLabel}</div>
                )}
                <div className="day-info">
                  <div className="day-name">{day.dayName}</div>
                  <div className="day-number">{day.label}</div>
                </div>
              </div>
            </th>
          );
        })}
      </tr>
    </thead>
  );
};
