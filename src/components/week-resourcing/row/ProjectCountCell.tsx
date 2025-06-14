
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
      pillClassName="bg-gradient-to-br from-gray-100 to-slate-100 border-gray-200 text-gray-700"
    />
  );
};
