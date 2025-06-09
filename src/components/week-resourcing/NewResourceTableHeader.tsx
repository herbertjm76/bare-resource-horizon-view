
import React from 'react';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface NewResourceTableHeaderProps {
  projects: any[];
}

export const NewResourceTableHeader: React.FC<NewResourceTableHeaderProps> = ({ projects }) => {
  // Calculate the number of project columns to show (minimum 15)
  const projectColumnsCount = Math.max(15, projects.length);

  return (
    <TableHeader>
      <TableRow className="bg-[#6465F0] hover:bg-[#6465F0]/90">
        {/* Sticky Name Column Header */}
        <TableHead className="text-white font-semibold text-center border-r sticky left-0 z-10 bg-[#6465F0] min-w-[120px] max-w-[150px]">
          <Tooltip>
            <TooltipTrigger asChild>
              <span>Name</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>Team member name</p>
            </TooltipContent>
          </Tooltip>
        </TableHead>
        
        <TableHead className="text-white font-semibold text-center border-r w-[32px] bg-[#6465F0]">
          <Tooltip>
            <TooltipTrigger asChild>
              <span>#</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>Number of projects assigned</p>
            </TooltipContent>
          </Tooltip>
        </TableHead>
        
        <TableHead className="text-white font-semibold text-center border-r w-[80px] bg-[#6465F0]">
          <Tooltip>
            <TooltipTrigger asChild>
              <span>Capacity</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>Weekly capacity utilization</p>
            </TooltipContent>
          </Tooltip>
        </TableHead>
        
        <TableHead className="text-white font-semibold text-center border-r w-[32px] bg-[#6465F0]">
          <Tooltip>
            <TooltipTrigger asChild>
              <span>AL</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>Annual Leave (hours)</p>
            </TooltipContent>
          </Tooltip>
        </TableHead>
        
        <TableHead className="text-white font-semibold text-center border-r w-[32px] bg-[#6465F0]">
          <Tooltip>
            <TooltipTrigger asChild>
              <span>HO</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>Holiday (hours)</p>
            </TooltipContent>
          </Tooltip>
        </TableHead>
        
        <TableHead className="text-white font-semibold text-center border-r w-[32px] bg-[#6465F0]">
          <Tooltip>
            <TooltipTrigger asChild>
              <span>OL</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>Other Leave (hours)</p>
            </TooltipContent>
          </Tooltip>
        </TableHead>
        
        <TableHead className="text-white font-semibold text-center border-r w-[32px] bg-[#6465F0]">
          <Tooltip>
            <TooltipTrigger asChild>
              <span>Off</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>Office location</p>
            </TooltipContent>
          </Tooltip>
        </TableHead>
        
        {/* Project Headers - show all projects or fill to minimum */}
        {Array.from({ length: projectColumnsCount }).map((_, idx) => {
          const project = projects[idx];
          if (project) {
            return (
              <TableHead 
                key={project.id} 
                className="text-white font-semibold text-center border-r w-[40px] bg-[#6465F0] relative"
                style={{ height: '80px' }}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div 
                        className="text-xs font-bold whitespace-nowrap"
                        style={{
                          transform: 'rotate(-90deg)',
                          transformOrigin: 'center',
                          width: '60px',
                          height: '20px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {project.project_code || project.name?.substring(0, 4) || 'N/A'}
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-xs">
                      <p className="font-semibold">{project.name}</p>
                      {project.project_code && <p>Code: {project.project_code}</p>}
                      {project.client_name && <p>Client: {project.client_name}</p>}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TableHead>
            );
          } else {
            return (
              <TableHead 
                key={`empty-${idx}`} 
                className="text-white font-semibold text-center border-r w-[40px] bg-[#6465F0]"
              />
            );
          }
        })}
      </TableRow>
    </TableHeader>
  );
};
