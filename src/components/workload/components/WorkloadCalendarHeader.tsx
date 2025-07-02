
import React from 'react';
import { format, isToday } from 'date-fns';

interface WorkloadCalendarHeaderProps {
  weekStartDates: Array<{ date: Date; key: string }>;
}

export const WorkloadCalendarHeader: React.FC<WorkloadCalendarHeaderProps> = ({ weekStartDates }) => {
  return (
    <thead>
      <tr>
        {/* Team Member column - Fixed width, sticky */}
        <th 
          className="workload-grid-header member-column"
          style={{ 
            backgroundColor: '#6465F0',
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
          Team Member
        </th>
        
        {/* Week columns - Fixed width */}
        {weekStartDates.map((week, index) => {
          const isTodayWeek = isToday(week.date);
          const isFirstOfMonth = week.date.getDate() <= 7;
          const isNewMonth = index === 0 || weekStartDates[index - 1].date.getMonth() !== week.date.getMonth();
          
          let backgroundColor = '#6465F0';
          if (isTodayWeek) {
            backgroundColor = '#f6ad55';
          }
          
          return (
            <th 
              key={week.key}
              className="workload-grid-header week-column"
              style={{ 
                width: '30px', 
                minWidth: '30px',
                maxWidth: '30px',
                backgroundColor,
                color: 'white',
                textAlign: 'center',
                padding: '4px 2px',
                borderRight: '1px solid rgba(156, 163, 175, 0.6)',
                borderBottom: '1px solid rgba(156, 163, 175, 0.8)',
                borderLeft: isFirstOfMonth ? '4px solid #fbbf24' : isNewMonth ? '2px solid #fbbf24' : undefined,
                fontSize: '12px',
                fontWeight: '600',
                height: '80px',
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
                      fontSize: '10px', 
                      fontWeight: '700', 
                      textTransform: 'uppercase', 
                      lineHeight: '1',
                      color: '#fbbf24',
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
                        opacity: '0.9', 
                        textTransform: 'uppercase', 
                        lineHeight: '1',
                        fontWeight: '500'
                      }}>
                        W{format(week.date, 'w')}
                      </span>
                      <span style={{ 
                        fontSize: '12px', 
                        fontWeight: '700', 
                        lineHeight: '1'
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
                      opacity: '0.9', 
                      textTransform: 'uppercase', 
                      lineHeight: '1',
                      fontWeight: '500'
                    }}>
                      W{format(week.date, 'w')}
                    </span>
                    <span style={{ 
                      fontSize: '12px', 
                      fontWeight: '700', 
                      lineHeight: '1'
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
            backgroundColor: '#7c3aed',
            color: 'white',
            textAlign: 'center',
            padding: '12px 8px',
            borderRight: 'none',
            borderBottom: '1px solid rgba(156, 163, 175, 0.8)',
            fontWeight: '600'
          }}
        >
          Total Hours
        </th>
      </tr>
    </thead>
  );
};
