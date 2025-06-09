
import React from 'react';
import { TableCell } from '@/components/ui/table';
import { CapacityBar } from '../CapacityBar';

interface CapacityCellProps {
  availableHours: number;
  totalCapacity: number;
}

export const CapacityCell: React.FC<CapacityCellProps> = ({ availableHours, totalCapacity }) => {
  // Calculate utilization percentage
  const usedHours = totalCapacity - availableHours;
  const utilizationPercentage = totalCapacity > 0 ? Math.round((usedHours / totalCapacity) * 100) : 0;
  
  // Get color based on utilization
  const getUtilizationColor = (percentage: number) => {
    if (percentage <= 0) return 'text-green-600'; // 0% - good, available
    if (percentage > 100) return 'text-red-600'; // Over 100% - overworked
    if (percentage >= 80) return 'text-orange-600'; // 80%+ - high capacity, under-resourced
    return 'text-blue-600'; // Normal range
  };

  return (
    <TableCell className="border-r p-1 sm:p-2 mobile-capacity-cell bg-gradient-to-br from-emerald-50 to-green-50">
      <div className="hidden sm:block">
        <CapacityBar 
          availableHours={availableHours} 
          totalCapacity={totalCapacity} 
        />
      </div>
      <div className="sm:hidden text-xs text-center">
        <span className={`font-bold ${getUtilizationColor(utilizationPercentage)}`}>
          {utilizationPercentage}%
        </span>
      </div>
    </TableCell>
  );
};
