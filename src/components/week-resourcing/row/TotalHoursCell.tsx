
import React from 'react';
import { TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface TotalHoursCellProps {
  totalHours: number;
  weeklyCapacity: number;
}

export const TotalHoursCell: React.FC<TotalHoursCellProps> = ({ totalHours, weeklyCapacity }) => {
  // Calculate utilization percentage
  const utilization = Math.round((totalHours / weeklyCapacity) * 100);
  
  return (
    <TableCell className="text-center p-0">
      <div className="flex flex-col items-center py-1">
        <span className="font-medium">{totalHours}</span>
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
