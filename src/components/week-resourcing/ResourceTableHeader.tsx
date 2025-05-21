
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
  return (
    <TableHeader>
      <TableRow className="border-b">
        {/* Fixed columns */}
        <TableHead className="sticky-column sticky-left-0 min-w-[160px] bg-muted/20 border-r z-20">Name</TableHead>
        <TableHead className="sticky-column sticky-left-12 w-10 bg-muted/20 border-r z-20 text-center">#</TableHead>
        <TableHead className="sticky-column sticky-left-24 w-10 bg-muted/20 border-r z-20 text-center">Office</TableHead>
        <TableHead className="sticky-column sticky-left-36 w-[120px] bg-muted/20 border-r z-20 text-center">Capacity</TableHead>
        
        {/* Leave columns */}
        <TableHead className="bg-muted/20 border-r text-center w-[80px]">Annual<br />Leave</TableHead>
        <TableHead className="bg-muted/20 border-r text-center w-[120px]">Other<br />Leave</TableHead>

        {/* Project columns - dynamically generated with distinct styling */}
        <TooltipProvider>
          {projects.map((project: any, index: number) => {
            // Alternate background colors for better distinction
            const isEven = index % 2 === 0;
            const bgClass = isEven ? "bg-muted/30" : "bg-muted/10";
            
            return (
              <TableHead 
                key={project.id} 
                className={`${bgClass} border-r text-center min-w-[80px]`}
              >
                <Tooltip>
                  <TooltipTrigger className="w-full h-full flex items-center justify-center">
                    <span className="font-medium">
                      {project.code || project.name.substring(0, 3).toUpperCase()}
                    </span>
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
        
        {/* Total column */}
        <TableHead className="bg-brand-primary/10 text-center min-w-[80px] font-semibold">Total</TableHead>
      </TableRow>
    </TableHeader>
  );
};
