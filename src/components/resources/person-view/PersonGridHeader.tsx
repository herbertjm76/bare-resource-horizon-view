import React from 'react';
import { WeekInfo } from '../hooks/useGridWeeks';
import { format, isWithinInterval, startOfDay, endOfDay } from 'date-fns';

interface PersonGridHeaderProps {
  weeks: WeekInfo[];
}

export const PersonGridHeader: React.FC<PersonGridHeaderProps> = ({ weeks }) => {
  const today = startOfDay(new Date());
  
  return (
    <thead>
      <tr>
        <th className="workload-resource-header project-resource-column" style={{ 
          backgroundColor: 'transparent', color: 'white', width: '250px', minWidth: '250px',
          maxWidth: '250px', position: 'sticky', left: '0', zIndex: 30, textAlign: 'left',
          padding: '12px 16px', borderRight: '2px solid rgba(156, 163, 175, 0.8)',
          borderBottom: '1px solid rgba(156, 163, 175, 0.8)', fontWeight: '600'
        }}>
          Person / Project
        </th>
        
        {weeks.map((week, index) => {
          const isCurrentWeek = isWithinInterval(today, {
            start: startOfDay(week.weekStartDate),
            end: endOfDay(week.weekEndDate)
          });
          const isNewMonth = index === 0 || weeks[index - 1].monthLabel !== week.monthLabel;
          
          return (
            <th key={`${week.weekStartDate.toISOString()}-${index}`}
              className="workload-resource-header week-column"
              style={{ 
                width: '80px', minWidth: '80px', maxWidth: '80px',
                backgroundColor: isCurrentWeek 
                  ? '#14b8a6'
                  : 'transparent',
                color: 'white', 
                textAlign: 'center',
                padding: '6px 4px', 
                borderRight: '1px solid rgba(156, 163, 175, 0.6)',
                borderBottom: '1px solid rgba(156, 163, 175, 0.8)',
                borderTop: isCurrentWeek ? '3px solid #0d9488' : 'none',
                fontSize: '11px',
                fontWeight: '600', 
                height: '60px',
                position: 'relative',
                ...(week.isPreviousWeek && { opacity: 0.4 }),
                ...(isCurrentWeek && {
                  boxShadow: '0 4px 12px rgba(20, 184, 166, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                })
              }}>
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                height: '100%', 
                gap: '2px',
                position: 'relative'
              }}>
                {isCurrentWeek && (
                  <span style={{ 
                    fontSize: '7px', 
                    fontWeight: '800', 
                    textTransform: 'uppercase', 
                    color: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    padding: '2px 6px',
                    borderRadius: '8px',
                    marginBottom: '2px',
                    letterSpacing: '0.5px'
                  }}>
                    THIS WEEK
                  </span>
                )}
                {isNewMonth && !isCurrentWeek && (
                  <span style={{ 
                    fontSize: '9px', 
                    fontWeight: '700', 
                    textTransform: 'uppercase', 
                    lineHeight: '1', 
                    color: '#fbbf24', 
                    marginBottom: '2px' 
                  }}>
                    {week.monthLabel}
                  </span>
                )}
                <div style={{ 
                  fontSize: isCurrentWeek ? '13px' : '11px', 
                  fontWeight: isCurrentWeek ? '700' : '500', 
                  lineHeight: '1.2',
                  color: 'white', 
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
