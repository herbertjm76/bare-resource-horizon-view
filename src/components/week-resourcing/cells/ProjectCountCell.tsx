
import React from 'react';
import { TableCell } from '@/components/ui/table';

interface ProjectCountCellProps {
  projectCount: number;
}

export const ProjectCountCell: React.FC<ProjectCountCellProps> = ({ projectCount }) => {
  return (
    <TableCell className="text-center border-r mobile-count-cell bg-gradient-to-br from-blue-50 to-indigo-50">
      <span className="inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 text-xs font-bold bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full shadow-sm border border-blue-200">
        {projectCount}
      </span>
    </TableCell>
  );
};
