import React from 'react';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ResourceTableHeaderProps {
  projects: any[];
  showRemarks?: boolean;
}

export const ResourceTableHeader: React.FC<ResourceTableHeaderProps> = ({ 
  projects,
  showRemarks = true 
}) => {
  // Ensure we always show at least 15 project columns
  const minProjectsToShow = 15;
  const projectsToRender = [...projects];
  
  // Add empty placeholders if we have less than 15 projects
  if (projects.length < minProjectsToShow) {
    const emptyProjectsNeeded = minProjectsToShow - projects.length;
    for (let i = 0; i < emptyProjectsNeeded; i++) {
      projectsToRender.push({
        id: `empty-project-${i}`,
        name: '',
        isEmpty: true
      });
    }
  }
  
  return (
    <TableHeader>
      <TableRow className="border-b">
        {/* Name column - 150px */}
        <TableHead className="sticky-column sticky-left-0 w-[150px] bg-muted/20 border-r z-20 text-center">Name</TableHead>
        
        {/* Project count column with circled # */}
        <TableHead className="sticky-column sticky-left-12 w-10 bg-muted/20 border-r z-20 text-center">
          <Tooltip>
            <TooltipTrigger className="w-full h-full flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-gray-250 flex items-center justify-center text-xs font-medium text-gray-600">
                #
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Number of Projects</p>
            </TooltipContent>
          </Tooltip>
        </TableHead>
        
        {/* Office column - code only */}
        <TableHead className="sticky-column sticky-left-24 w-10 bg-muted/20 border-r z-20 text-center">Office</TableHead>
        
        {/* Capacity column */}
        <TableHead className="sticky-column sticky-left-36 w-[120px] bg-muted/20 border-r z-20 text-center">Capacity</TableHead>
        
        {/* Annual Leave column with tooltip */}
        <TableHead className="bg-muted/20 border-r text-center w-[50px]">
          <Tooltip>
            <TooltipTrigger className="w-full h-full">
              <div className="w-6 h-6 rounded-full bg-gray-250 text-gray-600 flex items-center justify-center text-xs font-medium mx-auto">
                AL
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Annual Leave</p>
            </TooltipContent>
          </Tooltip>
        </TableHead>
        
        {/* Other Leave column with tooltip */}
        <TableHead className="bg-muted/20 border-r text-center w-[50px]">
          <Tooltip>
            <TooltipTrigger className="w-full h-full">
              <div className="w-6 h-6 rounded-full bg-gray-250 text-gray-600 flex items-center justify-center text-xs font-medium mx-auto">
                OL
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Other Leave</p>
            </TooltipContent>
          </Tooltip>
        </TableHead>
        
        {/* Holiday column with tooltip */}
        <TableHead className="bg-muted/20 border-r text-center w-[50px]">
          <Tooltip>
            <TooltipTrigger className="w-full h-full">
              <div className="w-6 h-6 rounded-full bg-gray-250 text-gray-600 flex items-center justify-center text-xs font-medium mx-auto">
                HO
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Holiday</p>
            </TooltipContent>
          </Tooltip>
        </TableHead>

        {/* Project columns - dynamically generated with distinct styling */}
        <TooltipProvider>
          {projectsToRender.map((project: any, index: number) => {
            // Alternate background colors for better distinction
            const isEven = index % 2 === 0;
            const bgClass = isEven ? "bg-muted/30" : "bg-muted/10";
            
            // For empty placeholder projects, just render an empty cell
            if (project.isEmpty) {
              return (
                <TableHead 
                  key={project.id} 
                  className={`${bgClass} border-r text-center w-[40px]`}
                />
              );
            }
            
            return (
              <TableHead 
                key={project.id} 
                className={`${bgClass} border-r text-center w-[40px] relative`}
              >
                <Tooltip>
                  <TooltipTrigger className="w-full h-full flex items-end justify-center pt-12">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 origin-center -rotate-90 whitespace-nowrap">
                      <span className="font-medium text-xs">
                        {project.code || project.name.substring(0, 3).toUpperCase()}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-medium">{project.name}</p>
                    {project.project_manager && (
                      <p className="text-xs text-muted-foreground">
                        PM: {project.project_manager.first_name} {project.project_manager.last_name}
                      </p>
                    )}
                  </TooltipContent>
                </Tooltip>
              </TableHead>
            );
          })}
        </TooltipProvider>
      </TableRow>
    </TableHeader>
  );
};
