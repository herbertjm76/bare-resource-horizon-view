
import React from 'react';
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Project } from './types';
import { useProjectDisplayText } from '@/hooks/useProjectDisplayText';

interface WeeklyResourceHeaderProps {
  projects: Project[];
}

export const WeeklyResourceHeader: React.FC<WeeklyResourceHeaderProps> = ({
  projects
}) => {
  const { getDisplayText, getTooltipText } = useProjectDisplayText();
  
  return (
    <TableHeader>
      <TableRow className="bg-header-bg hover:bg-header-bg">
        <TableHead className="text-header-foreground font-bold text-center border-r border-white/20 sticky left-0 z-20 bg-header-bg min-w-[120px] max-w-[150px]">
          TEAM MEMBER
        </TableHead>
        
        <TableHead className="text-header-foreground font-bold text-center border-r border-white/20 min-w-[60px] bg-header-bg">
          OFFICE
        </TableHead>
        
        <TableHead className="text-header-foreground font-bold text-center border-r border-white/20 min-w-[60px] bg-header-bg">
          CAPACITY
        </TableHead>
        
        <TableHead className="text-header-foreground font-bold text-center border-r border-white/20 min-w-[60px] bg-header-bg">
          COUNT
        </TableHead>
        
        <TableHead className="text-header-foreground font-bold text-center border-r border-white/20 min-w-[60px] bg-header-bg">
          TOTAL
        </TableHead>
        
        <TableHead className="text-header-foreground font-bold text-center border-r border-white/20 min-w-[80px] bg-header-bg">
          UTILIZATION
        </TableHead>
        
        <TableHead className="text-header-foreground font-bold text-center border-r border-white/20 min-w-[60px] bg-header-bg">
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
        
        <TableHead className="text-header-foreground font-bold text-center border-r border-white/20 min-w-[60px] bg-header-bg">
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
        
        <TableHead className="text-header-foreground font-bold text-center border-r border-white/20 min-w-[60px] bg-header-bg">
          OTHER LEAVE
        </TableHead>
        
        <TableHead className="text-header-foreground font-bold text-center border-r border-white/20 min-w-[60px] bg-header-bg">
          REMARKS
        </TableHead>
        
        {projects.map((project) => (
          <TableHead key={project.id} className="text-header-foreground font-bold text-center border-r border-white/20 min-w-[40px] max-w-[40px] p-1 bg-header-bg">
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
                    }}
                  >
                    {getDisplayText(project)}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-sm font-medium">
                    {getTooltipText(project)}
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
