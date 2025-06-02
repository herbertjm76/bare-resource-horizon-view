
import React from 'react';
import { Input } from '@/components/ui/input';

interface ResourceAllocationCellProps {
  hours: number;
  resourceId: string;
  projectId: string;
  weekStartDate: string;
}

export const ResourceAllocationCell: React.FC<ResourceAllocationCellProps> = ({
  hours,
  resourceId,
  projectId,
  weekStartDate
}) => {
  return (
    <div className="flex justify-center items-center h-full">
      {hours > 0 ? (
        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
          <span className="text-xs font-medium text-blue-700">{hours}</span>
        </div>
      ) : (
        <span className="text-muted-foreground text-xs">-</span>
      )}
    </div>
  );
};
