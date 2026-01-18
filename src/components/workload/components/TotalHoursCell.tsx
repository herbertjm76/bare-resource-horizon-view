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
        backgroundColor: 'hsl(var(--theme-primary) / 0.05)',
        textAlign: 'center',
        padding: '2px 4px',
        borderRight: 'none',
        borderBottom: '1px solid hsl(var(--border) / 0.3)',
        verticalAlign: 'middle',
        borderLeft: '2px solid hsl(var(--theme-primary) / 0.15)'
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