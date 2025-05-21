
import React from 'react';
import { TableCell } from '@/components/ui/table';
import { Briefcase } from 'lucide-react';

interface ProjectCountCellProps {
  projectCount: number;
}

export const ProjectCountCell: React.FC<ProjectCountCellProps> = ({ projectCount }) => {
  return (
    <TableCell className="sticky-column sticky-left-12 border-r p-0 text-center">
      <div className="flex items-center justify-center gap-1 py-1">
        <Briefcase size={14} className="text-muted-foreground" />
        <span className="text-xs font-medium">{projectCount}</span>
      </div>
    </TableCell>
  );
};
