
import React from 'react';
import { DisplayPillCell } from './DisplayPillCell';

interface ProjectCountCellProps {
  projectCount: number;
}

export const ProjectCountCell: React.FC<ProjectCountCellProps> = ({ projectCount }) => {
  return (
    <DisplayPillCell
      value={projectCount}
      pillClassName="bg-gradient-to-r from-purple-100 to-purple-200 border-purple-300 text-purple-800"
    />
  );
};
