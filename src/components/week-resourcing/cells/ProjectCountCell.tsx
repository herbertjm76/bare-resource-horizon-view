
import React from 'react';
import { TableCell } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';

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
    <TableCell className="text-center border-r mobile-count-cell bg-muted/20">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex items-center justify-center w-6 h-5 sm:w-8 sm:h-6 text-xs bg-muted text-muted-foreground rounded border border-border font-medium shadow-sm cursor-pointer hover:bg-muted/80 transition-colors">
              {projectCount}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            {projectsTooltip}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </TableCell>
  );
};
