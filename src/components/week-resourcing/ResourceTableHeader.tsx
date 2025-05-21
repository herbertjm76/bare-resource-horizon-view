
import React from 'react';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ResourceTableHeaderProps {
  projects: any[];
}

export const ResourceTableHeader: React.FC<ResourceTableHeaderProps> = ({
  projects
}) => {
  return (
    <TableHeader>
      <TableRow className="bg-muted/50 h-12">
        {/* Resource name column */}
        <TableHead className="sticky-header sticky-left-0 border-r border-b bg-muted/50 w-[80px] text-center">
          Resources
        </TableHead>
        
        {/* Projects count column */}
        <TableHead className="sticky-header sticky-left-12 border-r border-b bg-muted/50 w-[70px] text-center">
          Projects
        </TableHead>
        
        {/* Office location column */}
        <TableHead className="sticky-header sticky-left-24 border-r border-b bg-muted/50 w-[90px] text-center">
          Location
        </TableHead>
        
        {/* Capacity column */}
        <TableHead className="sticky-header sticky-left-36 border-r border-b bg-muted/50 w-[120px] text-center">
          Capacity
        </TableHead>
        
        {/* Leave columns group */}
        <TableHead colSpan={3} className="sticky-header border-r border-b bg-muted/50 text-center">
          Leave
        </TableHead>
        
        {/* Remarks column */}
        <TableHead className="sticky-header border-r border-b bg-muted/50 w-[160px] text-center">
          Remarks
        </TableHead>
        
        {/* Project columns - rotated headers */}
        {projects.map(project => (
          <TableHead 
            key={project.id} 
            className="sticky-header text-center border-r border-b bg-muted/50 w-[48px] p-0 relative"
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="date-label h-full w-full cursor-help">
                  <span className="font-semibold">{project.code}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{project.name}</p>
              </TooltipContent>
            </Tooltip>
          </TableHead>
        ))}
        
        {/* Total column */}
        <TableHead className="sticky-header text-center border-b bg-muted/50 w-[60px]">
          Total
        </TableHead>
      </TableRow>
      
      {/* Sub-header for leave types */}
      <TableRow className="bg-muted/30 h-8">
        {/* Empty cell for Resource column */}
        <TableHead className="sticky-header sticky-left-0 border-r border-b bg-muted/30"></TableHead>
        
        {/* Empty cell for Projects column */}
        <TableHead className="sticky-header sticky-left-12 border-r border-b bg-muted/30"></TableHead>
        
        {/* Empty cell for Location column */}
        <TableHead className="sticky-header sticky-left-24 border-r border-b bg-muted/30"></TableHead>
        
        {/* Empty cell for Capacity column */}
        <TableHead className="sticky-header sticky-left-36 border-r border-b bg-muted/30"></TableHead>
        
        {/* Leave sub-columns */}
        <TableHead className="text-center border-r border-b bg-muted/30 text-xs w-[80px]">
          Annual
        </TableHead>
        <TableHead className="text-center border-r border-b bg-muted/30 text-xs w-[80px]">
          Sick/Medical
        </TableHead>
        <TableHead className="text-center border-r border-b bg-muted/30 text-xs w-[80px]">
          Other
        </TableHead>
        
        {/* Remarks header */}
        <TableHead className="text-center border-r border-b bg-muted/30 text-xs"></TableHead>
        
        {/* Empty cells for Project columns */}
        {projects.map(project => (
          <TableHead key={`empty-${project.id}`} className="border-r border-b bg-muted/30"></TableHead>
        ))}
        
        {/* Empty cell for Total column */}
        <TableHead className="border-b bg-muted/30"></TableHead>
      </TableRow>
    </TableHeader>
  );
};
