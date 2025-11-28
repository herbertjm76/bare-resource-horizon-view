
import React from 'react';
import { WeekInfo } from '../hooks/useGridWeeks';
import { format, isWithinInterval, startOfDay, endOfDay } from 'date-fns';

interface WorkloadStyleWeekGridHeaderProps {
  weeks: WeekInfo[];
}

export const WorkloadStyleWeekGridHeader: React.FC<WorkloadStyleWeekGridHeaderProps> = ({ weeks }) => {
  const today = startOfDay(new Date());
  
  return (
    <thead>
      <tr>
        {/* Project/Resource column - Fixed width, sticky */}
        <th 
          className="workload-resource-header project-resource-column"
          style={{ 
            backgroundColor: 'transparent',
            color: 'white',
            width: '250px',
            minWidth: '250px',
            maxWidth: '250px',
            position: 'sticky',
            left: '0',
            zIndex: 30,
            textAlign: 'left',
            padding: '12px 16px',
            borderRight: '2px solid rgba(156, 163, 175, 0.8)',
            borderBottom: '1px solid rgba(156, 163, 175, 0.8)',
            fontWeight: '600'
          }}
        >
          Project / Resource
        </th>
        
        {/* Week columns - Fixed width */}
        {weeks.map((week, index) => {
          // Check if current week contains today
          const isCurrentWeek = isWithinInterval(today, {
            start: startOfDay(week.weekStartDate),
            end: endOfDay(week.weekEndDate)
          });
          
          const isNewMonth = index === 0 || weeks[index - 1].monthLabel !== week.monthLabel;
          
          return (
            <th 
              key={`${week.weekStartDate.toISOString()}-${index}`}
              className="workload-resource-header week-column"
              style={{ 
                width: '80px', 
                minWidth: '80px',
                maxWidth: '80px',
                backgroundColor: 'transparent',
                color: 'white',
                textAlign: 'center',
                padding: '6px 4px',
                borderRight: '1px solid rgba(156, 163, 175, 0.6)',
                borderBottom: '1px solid rgba(156, 163, 175, 0.8)',
                fontSize: '11px',
                fontWeight: '600',
                height: '60px',
                position: 'relative',
                overflow: 'visible',
                ...(week.isPreviousWeek && {
                  opacity: 0.4
                })
              }}
            >
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                height: '100%',
                gap: '2px'
              }}>
                {isNewMonth && (
                  <span style={{ 
                    fontSize: '9px', 
                    fontWeight: '700', 
                    textTransform: 'uppercase', 
                    lineHeight: '1',
                    color: isCurrentWeek ? '#10b981' : '#fbbf24',
                    marginBottom: '2px'
                  }}>
                    {week.monthLabel}
                  </span>
                )}
                <div style={{ 
                  fontSize: isCurrentWeek ? '12px' : '11px', 
                  fontWeight: isCurrentWeek ? '700' : '500', 
                  lineHeight: '1.2',
                  color: isCurrentWeek ? '#10b981' : 'white',
                  textAlign: 'center'
                }}>
                  <div>{format(week.weekStartDate, 'd')}-{format(week.weekEndDate, 'd')}</div>
                </div>
              </div>
            </th>
          );
        })}
      </tr>
    </thead>
  );
};
