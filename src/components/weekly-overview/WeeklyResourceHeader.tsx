
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
    <TableHeader>
      <TableRow className="bg-[#6465F0] hover:bg-[#6465F0]">
        <TableHead className="text-white font-bold text-center border-r border-white/20 sticky left-0 z-20 bg-[#6465F0] min-w-[120px] max-w-[150px]">
          TEAM MEMBER
        </TableHead>
        
        <TableHead className="text-white font-bold text-center border-r border-white/20 min-w-[60px] bg-[#6465F0]">
          OFFICE
        </TableHead>
        
        <TableHead className="text-white font-bold text-center border-r border-white/20 min-w-[60px] bg-[#6465F0]">
          CAPACITY
        </TableHead>
        
        <TableHead className="text-white font-bold text-center border-r border-white/20 min-w-[60px] bg-[#6465F0]">
          COUNT
        </TableHead>
        
        <TableHead className="text-white font-bold text-center border-r border-white/20 min-w-[60px] bg-[#6465F0]">
          TOTAL
        </TableHead>
        
        <TableHead className="text-white font-bold text-center border-r border-white/20 min-w-[80px] bg-[#6465F0]">
          UTILIZATION
        </TableHead>
        
        <TableHead className="text-white font-bold text-center border-r border-white/20 min-w-[60px] bg-[#6465F0]">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-pointer">ANNUAL LEAVE</span>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-sm font-medium">
                  Annual Leave hours for this week
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </TableHead>
        
        <TableHead className="text-white font-bold text-center border-r border-white/20 min-w-[60px] bg-[#6465F0]">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-pointer">HOLIDAY</span>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-sm font-medium">
                  Public Holiday hours for this week
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </TableHead>
        
        <TableHead className="text-white font-bold text-center border-r border-white/20 min-w-[60px] bg-[#6465F0]">
          OTHER LEAVE
        </TableHead>
        
        <TableHead className="text-white font-bold text-center border-r border-white/20 min-w-[60px] bg-[#6465F0]">
          REMARKS
        </TableHead>
        
        {projects.map((project) => (
          <TableHead key={project.id} className="text-white font-bold text-center border-r border-white/20 min-w-[40px] max-w-[40px] p-1 bg-[#6465F0]">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div 
                    className="project-code-header cursor-pointer"
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
                      padding: '0.25rem',
                      color: 'white'
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
            </TooltipProvider>
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
};
