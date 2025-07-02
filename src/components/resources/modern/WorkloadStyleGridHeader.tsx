
import React from 'react';
import { DayInfo } from '../grid/types';
import { format, isToday } from 'date-fns';

interface WorkloadStyleGridHeaderProps {
  days: DayInfo[];
}

export const WorkloadStyleGridHeader: React.FC<WorkloadStyleGridHeaderProps> = ({ days }) => {
  return (
    <thead>
      <tr>
        {/* Project/Resource column - Fixed width, sticky */}
        <th 
          className="workload-resource-header project-resource-column"
          style={{ 
            backgroundColor: 'hsl(var(--primary))',
            color: 'hsl(var(--primary-foreground))',
            width: '250px',
            minWidth: '250px',
            maxWidth: '250px',
            position: 'sticky',
            left: '0',
            zIndex: 30,
            textAlign: 'left',
            padding: '12px 16px',
            borderRight: '2px solid hsl(var(--border))',
            borderBottom: '1px solid hsl(var(--border))',
            fontWeight: '600',
            fontSize: '14px'
          }}
        >
          Project / Resource
        </th>
        
        {/* Day columns - Fixed width */}
        {days.map((day, index) => {
          const isTodayDay = isToday(day.date);
          const isFirstOfMonth = day.date.getDate() === 1;
          const isNewMonth = index === 0 || days[index - 1].date.getMonth() !== day.date.getMonth();
          
          let backgroundColor = 'hsl(var(--primary))';
          if (isTodayDay) {
            backgroundColor = 'hsl(var(--warning))';
          } else if (day.isWeekend) {
            backgroundColor = 'hsl(var(--muted))';
          }
          
          return (
            <th 
              key={`${day.date.toISOString()}-${index}`}
              className="workload-resource-header day-column"
              style={{ 
                width: '30px', 
                minWidth: '30px',
                maxWidth: '30px',
                backgroundColor,
                color: isTodayDay || day.isWeekend ? 'hsl(var(--foreground))' : 'hsl(var(--primary-foreground))',
                textAlign: 'center',
                padding: '4px 2px',
                borderRight: '1px solid hsl(var(--border))',
                borderBottom: '1px solid hsl(var(--border))',
                borderLeft: isFirstOfMonth ? '4px solid hsl(var(--warning))' : isNewMonth ? '2px solid hsl(var(--warning))' : undefined,
                fontSize: '11px',
                fontWeight: '600',
                height: '70px',
                position: 'relative',
                overflow: 'visible'
              }}
            >
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                height: '100%',
                gap: '2px'
              }}>
                {isNewMonth ? (
                  <>
                    <span style={{ 
                      fontSize: '9px', 
                      fontWeight: '700', 
                      textTransform: 'uppercase', 
                      lineHeight: '1',
                      color: 'hsl(var(--warning-foreground))',
                      marginBottom: '4px'
                    }}>
                      {format(day.date, 'MMM')}
                    </span>
                    <div style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      justifyContent: 'flex-end',
                      gap: '2px',
                      flex: '1'
                    }}>
                      <span style={{ 
                        fontSize: '9px', 
                        opacity: '0.8', 
                        textTransform: 'uppercase', 
                        lineHeight: '1',
                        fontWeight: '500'
                      }}>
                        {format(day.date, 'EEE').charAt(0)}
                      </span>
                      <span style={{ 
                        fontSize: '13px', 
                        fontWeight: '700', 
                        lineHeight: '1'
                      }}>
                        {format(day.date, 'd')}
                      </span>
                    </div>
                  </>
                ) : (
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'flex-end',
                    gap: '2px',
                    height: '100%',
                    paddingTop: '16px'
                  }}>
                    <span style={{ 
                      fontSize: '9px', 
                      opacity: '0.8', 
                      textTransform: 'uppercase', 
                      lineHeight: '1',
                      fontWeight: '500'
                    }}>
                      {format(day.date, 'EEE').charAt(0)}
                    </span>
                    <span style={{ 
                      fontSize: '13px', 
                      fontWeight: '700', 
                      lineHeight: '1'
                    }}>
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
