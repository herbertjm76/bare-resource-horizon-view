import React from 'react';

interface TotalHoursCellProps {
  totalHours: number;
  weeklyCapacity: number;
  periodWeeks: number;
}

export const TotalHoursCell: React.FC<TotalHoursCellProps> = ({ 
  totalHours, 
  weeklyCapacity, 
  periodWeeks 
}) => {
  // Calculate utilization percentage
  const totalCapacity = weeklyCapacity * periodWeeks;
  const utilizationRate = totalCapacity > 0 ? Math.round((totalHours / totalCapacity) * 100) : 0;
  
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
        color: utilizationRate > 100 ? '#dc2626' : 
               utilizationRate > 80 ? '#f59e0b' : 
               utilizationRate > 0 ? '#1f2937' : '#9ca3af'
      }}>
        {utilizationRate}%
      </span>
    </td>
  );
};