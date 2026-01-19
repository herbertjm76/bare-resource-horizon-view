
import React from 'react';
import { TableHeader, TableRow, TableHead } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { getProjectAbbreviation, getProjectTooltip } from '@/utils/projectDisplay';

interface ResourceTableHeaderProps {
  projects: any[];
  showRemarks?: boolean;
}

export const ResourceTableHeader: React.FC<ResourceTableHeaderProps> = ({ projects, showRemarks = false }) => {
  return (
    <TableHeader className="sticky top-0 z-10 bg-header-bg border-b">
      <TableRow className="h-20 bg-header-bg hover:bg-header-bg">
        <TableHead className="w-48 max-w-48 min-w-32 border-r sticky left-0 z-20 non-project-column bg-header-bg text-header-foreground">Name</TableHead>
        <TableHead className="w-16 text-center border-r non-project-column bg-header-bg text-header-foreground">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-pointer">Projects</span>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-sm font-medium">
                  Number of projects assigned this week
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </TableHead>
        
        <TableHead className="w-36 text-center border-r non-project-column bg-header-bg text-header-foreground">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-pointer">Total Utilization</span>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-sm space-y-1">
                  <p className="font-medium">Color Legend:</p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>Project Hours</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500" />
                    <span>Annual Leave</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                    <span>Public Holidays</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-gray-500" />
                    <span>Other Leave</span>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </TableHead>
        
        {projects.map((project, idx) => {
          return (
            <TableHead 
              key={project.id} 
              className="w-10 text-center project-header relative bg-header-bg"
            >
              {!project.isEmpty && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="absolute inset-0 flex items-center justify-center p-1">
                        <div 
                          className="project-code-text text-xs font-bold whitespace-nowrap cursor-pointer text-header-foreground"
                          style={{
                            transform: 'rotate(-90deg)',
                            transformOrigin: 'center',
                            width: '60px',
                            height: '60px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            padding: '0.25rem',
                          }}
                        >
                          {getProjectAbbreviation(project)}
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="text-sm font-medium">
                        {getProjectTooltip(project)}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </TableHead>
          );
        })}
        
        {showRemarks && (
          <TableHead className="w-40 text-center border-r non-project-column bg-header-bg text-header-foreground">Remarks</TableHead>
        )}
      </TableRow>
    </TableHeader>
  );
};
