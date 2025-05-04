
import React from 'react';
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Project } from './types';

interface WeeklyResourceHeaderProps {
  projects: Project[];
}

export const WeeklyResourceHeader: React.FC<WeeklyResourceHeaderProps> = ({ projects }) => {
  return (
    <TableHeader className="bg-muted/50 sticky top-0 z-10">
      <TableRow>
        <TableHead className="py-2 px-4 name-column">
          <div className="font-medium">Name</div>
        </TableHead>
        
        <TooltipProvider>
          <TableHead className="header-cell number-column">
            <Tooltip>
              <TooltipTrigger className="w-full">
                <div className="font-medium">PRJ</div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Projects</p>
              </TooltipContent>
            </Tooltip>
          </TableHead>
          
          <TableHead className="header-cell capacity-column">
            <Tooltip>
              <TooltipTrigger className="w-full">
                <div className="font-medium">CAP</div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Capacity</p>
              </TooltipContent>
            </Tooltip>
          </TableHead>
          
          <TableHead className="header-cell number-column">
            <Tooltip>
              <TooltipTrigger className="w-full">
                <div className="font-medium">UTL</div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Utilisation</p>
              </TooltipContent>
            </Tooltip>
          </TableHead>
          
          <TableHead className="header-cell number-column leave-column">
            <Tooltip>
              <TooltipTrigger className="w-full">
                <div className="font-medium">AL</div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Annual Leave</p>
              </TooltipContent>
            </Tooltip>
          </TableHead>
          
          <TableHead className="header-cell number-column">
            <Tooltip>
              <TooltipTrigger className="w-full">
                <div className="font-medium">PH</div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Public Holiday</p>
              </TooltipContent>
            </Tooltip>
          </TableHead>
          
          <TableHead className="header-cell number-column leave-column">
            <Tooltip>
              <TooltipTrigger className="w-full">
                <div className="font-medium">VL</div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Vacation Leave</p>
              </TooltipContent>
            </Tooltip>
          </TableHead>
          
          <TableHead className="header-cell number-column leave-column">
            <Tooltip>
              <TooltipTrigger className="w-full">
                <div className="font-medium">ML</div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Medical Leave</p>
              </TooltipContent>
            </Tooltip>
          </TableHead>
          
          <TableHead className="header-cell number-column leave-column">
            <Tooltip>
              <TooltipTrigger className="w-full">
                <div className="font-medium">OL</div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Others</p>
              </TooltipContent>
            </Tooltip>
          </TableHead>
        </TooltipProvider>
        
        <TableHead className="py-2 px-4 remarks-column">
          <div className="font-medium">Remarks</div>
        </TableHead>
        
        {/* Project columns - each project in the company gets its own column */}
        {projects.map(project => (
          <TableHead 
            key={project.id} 
            className="project-code-column relative"
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="w-full h-full">
                  <div className="project-code-header">
                    {project.code}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>{project.name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
};
