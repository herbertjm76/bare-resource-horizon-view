import React from 'react';
import { format, isToday } from 'date-fns';

interface WorkloadCalendarHeaderProps {
  weekStartDates: Array<{ date: Date; key: string }>;
  shouldCenterAlign?: boolean;
}

export const WorkloadCalendarHeader: React.FC<WorkloadCalendarHeaderProps> = ({ 
  weekStartDates, 
  shouldCenterAlign = false 
}) => {
  const weekCount = weekStartDates.length;
  const weekText = weekCount === 1 ? 'week' : 'weeks';
  
  return (
    <thead>
      <tr style={{ backgroundColor: 'hsl(var(--theme-primary) / 0.05)' }}>
        {/* Team Member column - Fixed width, conditionally sticky */}
        <th 
          className="workload-grid-header member-column"
          style={{ 
            backgroundColor: 'hsl(var(--theme-primary) / 0.1)',
            color: 'hsl(var(--foreground))',
            width: '250px',
            minWidth: '250px',
            maxWidth: '250px',
            position: shouldCenterAlign ? 'static' : 'sticky',
            left: shouldCenterAlign ? 'auto' : '0',
            zIndex: shouldCenterAlign ? 25 : 30,
            textAlign: 'left',
            padding: '12px 16px',
            borderRight: '2px solid hsl(var(--theme-primary) / 0.15)',
            borderBottom: '1px solid hsl(var(--border))',
            fontWeight: '600',
            borderTopLeftRadius: '0.5rem'
          }}
        >
          Team Member
        </th>
        
        {/* Week columns - Fixed width */}
        {weekStartDates.map((week, index) => {
          const isTodayWeek = isToday(week.date);
          const isFirstOfMonth = week.date.getDate() <= 7;
          const isNewMonth = index === 0 || weekStartDates[index - 1].date.getMonth() !== week.date.getMonth();
          
          return (
            <th 
              key={week.key}
              className="workload-grid-header week-column"
              style={{ 
                width: '30px', 
                minWidth: '30px',
                maxWidth: '30px',
                textAlign: 'center',
                padding: '4px 2px',
                borderRight: '1px solid hsl(var(--border) / 0.5)',
                borderBottom: '1px solid hsl(var(--border))',
                borderLeft: isNewMonth ? '2px solid hsl(var(--theme-primary) / 0.4)' : undefined,
                fontSize: '12px',
                fontWeight: '600',
                height: '80px',
                position: 'relative',
                overflow: 'visible',
                backgroundColor: isTodayWeek 
                  ? 'hsl(var(--theme-primary) / 0.2)' 
                  : 'hsl(var(--theme-primary) / 0.05)',
                color: 'hsl(var(--foreground))'
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
                      fontSize: '10px', 
                      fontWeight: '700', 
                      textTransform: 'uppercase', 
                      lineHeight: '1',
                      color: 'hsl(var(--theme-primary))',
                      marginBottom: '4px'
                    }}>
                      {format(week.date, 'MMM')}
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
                        fontSize: '10px', 
                        opacity: '0.7', 
                        textTransform: 'uppercase', 
                        lineHeight: '1',
                        fontWeight: '500'
                      }}>
                        W{format(week.date, 'w')}
                      </span>
                      <span style={{ 
                        fontSize: '12px', 
                        fontWeight: '700', 
                        lineHeight: '1',
                        color: isTodayWeek ? 'hsl(var(--theme-primary))' : undefined
                      }}>
                        {format(week.date, 'd')}
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
                      fontSize: '10px', 
                      opacity: '0.7', 
                      textTransform: 'uppercase', 
                      lineHeight: '1',
                      fontWeight: '500'
                    }}>
                      W{format(week.date, 'w')}
                    </span>
                    <span style={{ 
                      fontSize: '12px', 
                      fontWeight: '700', 
                      lineHeight: '1',
                      color: isTodayWeek ? 'hsl(var(--theme-primary))' : undefined
                    }}>
                      {format(week.date, 'd')}
                    </span>
                  </div>
                )}
              </div>
            </th>
          );
        })}

        {/* Total column - Fixed width */}
        <th 
          className="workload-grid-header total-column"
          style={{ 
            width: '120px', 
            minWidth: '120px',
            maxWidth: '120px',
            textAlign: 'center',
            padding: '12px 8px',
            borderLeft: '2px solid hsl(var(--theme-primary) / 0.15)',
            borderBottom: '1px solid hsl(var(--border))',
            fontWeight: '600',
            backgroundColor: 'hsl(var(--theme-primary) / 0.1)',
            color: 'hsl(var(--foreground))',
            borderTopRightRadius: '0.5rem'
          }}
        >
          Total Utilization ({weekCount} {weekText})
        </th>
      </tr>
    </thead>
  );
};
