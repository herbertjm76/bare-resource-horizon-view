import React from 'react';

interface TotalHoursCellProps {
  totalHours: number;
}

export const TotalHoursCell: React.FC<TotalHoursCellProps> = ({ totalHours }) => {
  return (
    <td 
      className="workload-grid-cell total-cell"
      style={{ 
        width: '120px', 
        minWidth: '120px',
        maxWidth: '120px',
        backgroundColor: '#f8fafc',
        textAlign: 'center',
        padding: '12px 8px',
        borderRight: 'none',
        borderBottom: '1px solid rgba(156, 163, 175, 0.2)',
        verticalAlign: 'middle',
        fontWeight: '600'
      }}
    >
      <span style={{ 
        fontSize: '14px',
        fontWeight: '700',
        color: totalHours > 0 ? '#1f2937' : '#9ca3af'
      }}>
        {totalHours}h
      </span>
    </td>
  );
};