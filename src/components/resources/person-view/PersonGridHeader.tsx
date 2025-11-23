import React from 'react';
import { DayInfo } from '../grid/types';

interface PersonGridHeaderProps {
  days: DayInfo[];
}

export const PersonGridHeader: React.FC<PersonGridHeaderProps> = ({ days }) => {
  return (
    <thead>
      <tr className="workload-resource-header-row">
        {/* Person column header - Fixed width, sticky */}
        <th 
          className="workload-resource-header person-resource-column"
          style={{
            width: '250px',
            minWidth: '250px',
            maxWidth: '250px',
            position: 'sticky',
            left: '0',
            zIndex: 30,
            textAlign: 'left',
            padding: '12px 16px',
            backgroundColor: '#f3f4f6',
            borderRight: '2px solid rgba(156, 163, 175, 0.8)',
            borderBottom: '2px solid rgba(156, 163, 175, 0.8)',
            fontWeight: '700',
            fontSize: '13px',
            color: '#111827'
          }}
        >
          TEAM MEMBER
        </th>
        
        {/* Day column headers */}
        {days.map((day) => {
          const isWeekend = day.isWeekend;
          const dayKey = day.date.toISOString().split('T')[0];
          
          return (
            <th 
              key={dayKey}
              className={`workload-resource-header day-column ${isWeekend ? 'weekend' : ''}`}
              style={{
                width: '30px',
                minWidth: '30px',
                maxWidth: '30px',
                textAlign: 'center',
                padding: '4px 2px',
                backgroundColor: isWeekend ? '#fee' : '#f3f4f6',
                borderRight: '1px solid rgba(156, 163, 175, 0.6)',
                borderBottom: '2px solid rgba(156, 163, 175, 0.8)',
                fontSize: '10px',
                fontWeight: '600',
                color: '#374151'
              }}
              title={day.date.toLocaleDateString()}
            >
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                gap: '2px'
              }}>
                <span style={{ fontSize: '9px', color: '#6b7280' }}>
                  {day.dayName.slice(0, 3)}
                </span>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#111827' }}>
                  {day.date.getDate()}
                </span>
              </div>
            </th>
          );
        })}
      </tr>
    </thead>
  );
};
