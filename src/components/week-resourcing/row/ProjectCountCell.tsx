
import React from 'react';
import { DisplayPillCell } from './DisplayPillCell';

interface ProjectCountCellProps {
  projectCount: number;
}

export const ProjectCountCell: React.FC<ProjectCountCellProps> = ({ projectCount }) => {
  return (
    <DisplayPillCell
      value={projectCount}
      label=""
      pillClassName="bg-gradient-to-br from-muted to-slate-100 border-border text-foreground"
    />
  );
};
