
import React from 'react';
import { TableCell } from '@/components/ui/table';
import { CapacityBar } from '../CapacityBar';

interface CapacityBarCellProps {
  availableHours: number;
  totalCapacity: number;
}

export const CapacityBarCell: React.FC<CapacityBarCellProps> = ({ 
  availableHours, 
  totalCapacity 
}) => {
  return (
    <TableCell className="text-center p-2">
      <CapacityBar 
        availableHours={availableHours} 
        totalCapacity={totalCapacity} 
      />
    </TableCell>
  );
};
