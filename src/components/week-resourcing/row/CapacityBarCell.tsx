
import React from 'react';
import { TableCell } from '@/components/ui/table';
import { CapacityBar } from '../CapacityBar';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';

interface CapacityBarCellProps {
  totalUsedHours: number;
  totalCapacity: number;
}

export const CapacityBarCell: React.FC<CapacityBarCellProps> = ({
  totalUsedHours,
  totalCapacity
}) => {
  return (
    <TableCell className="text-center border-r p-1">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="cursor-pointer">
              <CapacityBar 
                totalUsedHours={totalUsedHours} 
                totalCapacity={totalCapacity} 
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-sm font-medium">
              <p>Used: {totalUsedHours}h / {totalCapacity}h</p>
              <p>Available: {Math.max(0, totalCapacity - totalUsedHours)}h</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </TableCell>
  );
};
