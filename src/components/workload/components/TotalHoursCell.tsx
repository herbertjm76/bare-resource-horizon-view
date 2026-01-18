import React from 'react';
import { StandardizedBadge } from '@/components/ui/standardized-badge';

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
        padding: '2px 4px',
        borderRight: 'none',
        borderBottom: '1px solid rgba(156, 163, 175, 0.2)',
        verticalAlign: 'middle',
      }}
    >
      <StandardizedBadge 
        variant={utilizationRate > 100 ? "error" : utilizationRate > 80 ? "warning" : "metric"} 
        size="sm"
      >
        {utilizationRate}%
      </StandardizedBadge>
    </td>
  );
};