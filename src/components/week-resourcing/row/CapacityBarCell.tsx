
import React from 'react';
import { TableCell } from '@/components/ui/table';
import { CapacityBar } from '../CapacityBar';

interface CapacityBarCellProps {
  availableHours: number;
  totalCapacity: number;
}

export const CapacityBarCell: React.FC<CapacityBarCellProps> = ({ availableHours, totalCapacity }) => {
  return (
    <TableCell className="sticky-column sticky-left-36 border-r p-0 align-middle">
      <div className="flex justify-center items-center h-full">
        <CapacityBar
          availableHours={availableHours} 
          totalCapacity={totalCapacity} 
        />
      </div>
    </TableCell>
  );
};
