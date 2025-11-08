import React from 'react';
import { TableCell } from '@/components/ui/table';
import { StandardizedBadge } from '@/components/ui/standardized-badge';

interface TotalHoursCellProps {
  totalHours: number;
  weeklyCapacity: number;
  periodWeeks?: number;
}

export const TotalHoursCell: React.FC<TotalHoursCellProps> = ({ totalHours, weeklyCapacity, periodWeeks = 1 }) => {
  // Calculate utilization percentage
  const totalCapacity = weeklyCapacity * periodWeeks;
  const utilization = totalCapacity > 0 ? Math.round((totalHours / totalCapacity) * 100) : 0;
  
  return (
    <TableCell className="text-center p-0">
      <div className="flex flex-col items-center py-1">
        <StandardizedBadge 
          variant={utilization > 100 ? "error" : utilization > 80 ? "warning" : "metric"} 
          size="sm"
        >
          {utilization}%
        </StandardizedBadge>
      </div>
    </TableCell>
  );
};
