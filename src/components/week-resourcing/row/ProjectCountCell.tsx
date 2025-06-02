
import React from 'react';
import { TableCell } from '@/components/ui/table';

interface ProjectCountCellProps {
  projectCount: number;
}

export const ProjectCountCell: React.FC<ProjectCountCellProps> = ({ projectCount }) => {
  return (
    <TableCell className="w-16 text-center border-r p-2">
      <div className="flex items-center justify-center">
        <div className="bg-gray-250 w-7 h-6 rounded-md flex items-center justify-center">
          <span className="text-xs font-medium text-gray-600">{projectCount}</span>
        </div>
      </div>
    </TableCell>
  );
};
