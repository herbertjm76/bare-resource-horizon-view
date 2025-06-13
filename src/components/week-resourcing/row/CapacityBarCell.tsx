
import React from 'react';
import { TableCell } from '@/components/ui/table';
import { CapacityBar } from '../CapacityBar';

interface CapacityBarCellProps {
  totalUsedHours: number;
  totalCapacity: number;
}

export const CapacityBarCell: React.FC<CapacityBarCellProps> = ({ 
  totalUsedHours, 
  totalCapacity 
}) => {
  return (
    <TableCell className="text-center p-2">
      <CapacityBar 
        totalUsedHours={totalUsedHours} 
        totalCapacity={totalCapacity} 
      />
    </TableCell>
  );
};
