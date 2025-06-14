
import React from 'react';
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Project } from './types';

interface NewResourceTableHeaderProps {
  projects: Project[];
  viewMode?: 'compact' | 'expanded';
}

export const NewResourceTableHeader: React.FC<NewResourceTableHeaderProps> = ({
  projects,
  viewMode = 'compact'
}) => {
  const isExpanded = viewMode === 'expanded';
  
  const headerPadding = isExpanded ? 'py-4 px-4' : 'py-2 px-2';
  const headerTextSize = isExpanded ? 'text-sm' : 'text-xs';
  const headerHeight = isExpanded ? 'h-16' : 'h-12';

  return (
    <TableHeader>
      <TableRow className={`bg-[#6465F0] hover:bg-[#6465F0] ${headerHeight}`}>
        <TableHead className={`text-white font-bold text-center border-r border-white/20 sticky left-0 z-20 bg-[#6465F0] ${isExpanded ? 'min-w-[120px] max-w-[150px]' : 'name-column'} ${headerPadding} ${headerTextSize}`}>
          TEAM MEMBER
        </TableHead>
        
        <TableHead className={`text-white font-bold text-center border-r border-white/20 ${isExpanded ? 'min-w-[60px]' : 'count-column'} ${headerPadding} ${headerTextSize}`}>
          COUNT
        </TableHead>
        
        <TableHead className={`text-white font-bold text-center border-r border-white/20 ${isExpanded ? 'min-w-[80px]' : 'utilization-column'} ${headerPadding} ${headerTextSize}`}>
          UTILIZATION
        </TableHead>
        
        <TableHead className={`text-white font-bold text-center border-r border-white/20 ${isExpanded ? 'min-w-[60px]' : 'leave-column'} ${headerPadding} ${headerTextSize}`}>
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
        
        <TableHead className={`text-white font-bold text-center border-r border-white/20 ${isExpanded ? 'min-w-[60px]' : 'leave-column'} ${headerPadding} ${headerTextSize}`}>
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
        
        <TableHead className={`text-white font-bold text-center border-r border-white/20 ${isExpanded ? 'min-w-[60px]' : 'other-leave-column'} ${headerPadding} ${headerTextSize}`}>
          OTHER LEAVE
        </TableHead>
        
        <TableHead className={`text-white font-bold text-center border-r border-white/20 ${isExpanded ? 'min-w-[60px]' : 'remarks-column'} ${headerPadding} ${headerTextSize}`}>
          REMARKS
        </TableHead>
        
        {projects.map((project) => (
          <TableHead key={project.id} className={`text-white font-bold text-center border-r border-white/20 ${isExpanded ? 'min-w-[40px] max-w-[40px]' : 'project-column'} ${isExpanded ? 'p-2' : 'p-1'}`}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div 
                    className="project-code-header cursor-pointer"
                    style={{
                      writingMode: 'vertical-lr',
                      textOrientation: 'mixed',
                      height: isExpanded ? '100px' : '80px',
                      transform: 'rotate(180deg)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: isExpanded ? '0.875rem' : '0.75rem',
                      fontWeight: '600',
                      padding: isExpanded ? '0.5rem' : '0.25rem',
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
