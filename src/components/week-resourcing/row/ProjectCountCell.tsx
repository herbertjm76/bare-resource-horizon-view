
import React from 'react';
import { TableCell } from '@/components/ui/table';

interface ProjectCountCellProps {
  projectCount: number;
}

export const ProjectCountCell: React.FC<ProjectCountCellProps> = ({ projectCount }) => {
  return (
    <TableCell className="sticky-column sticky-left-12 border-r p-0 text-center">
      <div className="flex items-center justify-center">
        <div className="bg-gray-250 w-7 h-6 rounded-md flex items-center justify-center">
          <span className="text-xs font-medium text-gray-600">{projectCount}</span>
        </div>
      </div>
    </TableCell>
  );
};
