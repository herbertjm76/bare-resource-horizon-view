
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
        {/* Control column */}
        <th className="modern-header-cell control-column">
          <div className="header-content">
            <span className="header-label">View</span>
          </div>
        </th>
        
        {/* Project column */}
        <th className="modern-header-cell project-column">
          <div className="header-content">
            <span className="header-label">Project / Resource</span>
          </div>
        </th>
        
        {/* Day columns */}
        {days.map((day, index) => {
          const isTodayDay = isToday(day.date);
          const isNewMonth = index === 0 || days[index - 1].monthLabel !== day.monthLabel;
          
          let headerClasses = 'modern-header-cell day-column';
          if (isTodayDay) headerClasses += ' today';
          if (day.isWeekend) headerClasses += ' weekend';
          if (day.isSunday) headerClasses += ' sunday';
          if (day.isFirstOfMonth) headerClasses += ' month-start';
          
          return (
            <th key={`${day.date.toISOString()}-${index}`} className={headerClasses}>
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
