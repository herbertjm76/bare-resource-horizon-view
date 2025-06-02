
import React from 'react';
import { TableCell } from '@/components/ui/table';
import { CapacityBar } from '../CapacityBar';

interface CapacityBarCellProps {
  availableHours: number;
  totalCapacity: number;
}

export const CapacityBarCell: React.FC<CapacityBarCellProps> = ({ availableHours, totalCapacity }) => {
  return (
    <TableCell className="w-32 text-center border-r p-2">
      <div className="flex justify-center items-center h-full">
        <CapacityBar
          availableHours={availableHours} 
          totalCapacity={totalCapacity} 
        />
      </div>
    </TableCell>
  );
};
