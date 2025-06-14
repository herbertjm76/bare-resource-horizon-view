
import React from 'react';
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Project } from './types';

interface WeeklyResourceHeaderProps {
  projects: Project[];
}

export const WeeklyResourceHeader: React.FC<WeeklyResourceHeaderProps> = ({
  projects
}) => {
  return (
    <TooltipProvider>
      <TableHeader>
        <TableRow className="bg-[#6465F0] hover:bg-[#6465F0]">
          <TableHead className="text-white font-bold text-center border-r border-white/20 sticky left-0 z-20 bg-[#6465F0] min-w-[120px] max-w-[150px]">
            TEAM MEMBER
          </TableHead>
          
          <TableHead className="text-white font-bold text-center border-r border-white/20 min-w-[60px]">
            OFFICE
          </TableHead>
          
          <TableHead className="text-white font-bold text-center border-r border-white/20 min-w-[60px]">
            CAPACITY
          </TableHead>
          
          <TableHead className="text-white font-bold text-center border-r border-white/20 min-w-[60px]">
            COUNT
          </TableHead>
          
          <TableHead className="text-white font-bold text-center border-r border-white/20 min-w-[60px]">
            TOTAL
          </TableHead>
          
          <TableHead className="text-white font-bold text-center border-r border-white/20 min-w-[80px]">
            UTILIZATION
          </TableHead>
          
          <TableHead className="text-white font-bold text-center border-r border-white/20 min-w-[60px]">
            ANNUAL LEAVE
          </TableHead>
          
          <TableHead className="text-white font-bold text-center border-r border-white/20 min-w-[60px]">
            HOLIDAY
          </TableHead>
          
          <TableHead className="text-white font-bold text-center border-r border-white/20 min-w-[60px]">
            OTHER LEAVE
          </TableHead>
          
          <TableHead className="text-white font-bold text-center border-r border-white/20 min-w-[60px]">
            REMARKS
          </TableHead>
          
          {projects.map((project) => (
            <TableHead key={project.id} className="text-white font-bold text-center border-r border-white/20 min-w-[40px] max-w-[40px] p-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div 
                    className="project-code-header cursor-help"
                    style={{
                      writingMode: 'vertical-lr',
                      textOrientation: 'mixed',
                      height: '80px',
                      transform: 'rotate(180deg)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      padding: '0.25rem'
                    }}
                  >
                    {project.code}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-sm font-medium">
                    {project.name}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
    </TooltipProvider>
  );
};
