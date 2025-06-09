
import React from 'react';
import { TableCell } from '@/components/ui/table';
import { CapacityBar } from '../CapacityBar';

interface CapacityCellProps {
  availableHours: number;
  totalCapacity: number;
}

export const CapacityCell: React.FC<CapacityCellProps> = ({ availableHours, totalCapacity }) => {
  return (
    <TableCell className="border-r p-1 sm:p-2 mobile-capacity-cell bg-gradient-to-br from-emerald-50 to-green-50">
      <div className="hidden sm:block">
        <CapacityBar 
          availableHours={availableHours} 
          totalCapacity={totalCapacity} 
        />
      </div>
      <div className="sm:hidden text-xs text-center">
        <span className="text-emerald-600 font-bold">{availableHours}</span>
        <span className="text-gray-400 mx-1">/</span>
        <span className="text-gray-600 font-medium">{totalCapacity}</span>
      </div>
    </TableCell>
  );
};
