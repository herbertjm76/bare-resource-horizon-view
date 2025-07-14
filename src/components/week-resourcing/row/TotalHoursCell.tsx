
import React from 'react';
import { TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

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
        <Badge 
          variant={utilization > 100 ? "destructive" : utilization > 80 ? "warning" : "outline"} 
          className="text-xs py-0 px-1.5 h-5"
        >
          {utilization}%
        </Badge>
      </div>
    </TableCell>
  );
};
