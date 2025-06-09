
import React from 'react';
import { TableCell } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface ProjectCountCellProps {
  projectCount: number;
  projects?: Array<{ name: string; hours: number; project_code?: string }>;
}

export const ProjectCountCell: React.FC<ProjectCountCellProps> = ({ projectCount, projects = [] }) => {
  const projectsTooltip = projects.length > 0 ? (
    <div className="space-y-1 text-xs max-w-xs">
      <p className="font-semibold">Assigned Projects:</p>
      {projects.map((project, idx) => (
        <div key={idx} className="flex justify-between gap-2">
          <span className="truncate">{project.name}</span>
          <span className="font-medium">{project.hours}h</span>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-xs">No projects assigned</p>
  );

  return (
    <TableCell className="text-center border-r mobile-count-cell bg-gradient-to-br from-blue-50 to-indigo-50">
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 text-xs font-bold bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full shadow-sm border border-blue-200">
            {projectCount}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          {projectsTooltip}
        </TooltipContent>
      </Tooltip>
    </TableCell>
  );
};
