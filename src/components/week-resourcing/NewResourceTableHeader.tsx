
import React from 'react';
import { TableHeader, TableRow, TableHead } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';

interface NewResourceTableHeaderProps {
  projects: any[];
}

export const NewResourceTableHeader: React.FC<NewResourceTableHeaderProps> = ({ projects }) => {
  const projectColumnsCount = Math.max(15, projects.length);
  
  return (
    <TableHeader className="sticky top-0 z-20">
      <TableRow className="h-20" style={{ backgroundColor: '#6465F0' }}>
        <TableHead className="sticky-column sticky-left-0 border-r text-center font-semibold min-w-[150px] max-w-[150px] w-[150px]" style={{ backgroundColor: '#6465F0', color: 'white' }}>
          Name
        </TableHead>
        
        <TableHead className="w-12 text-center border-r font-semibold" style={{ backgroundColor: '#6465F0', color: 'white' }}>
          #
        </TableHead>
        
        <TableHead className="w-32 text-center border-r font-semibold" style={{ backgroundColor: '#6465F0', color: 'white' }}>
          Capacity
        </TableHead>
        
        <TableHead className="w-12 text-center border-r font-semibold" style={{ backgroundColor: '#6465F0', color: 'white' }}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-pointer">AL</span>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-sm font-medium">
                  Annual Leave hours for this week
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </TableHead>
        <TableHead className="w-12 text-center border-r font-semibold" style={{ backgroundColor: '#6465F0', color: 'white' }}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-pointer">HO</span>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-sm font-medium">
                  Public Holiday hours for this week
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </TableHead>
        <TableHead className="w-12 text-center border-r-4 border-gray-400 font-semibold" style={{ backgroundColor: '#6465F0', color: 'white' }}>
          OL
        </TableHead>
        
        {Array.from({ length: projectColumnsCount }).map((_, idx) => {
          const project = projects[idx];
          return (
            <TableHead 
              key={project?.id || `empty-${idx}`}
              className="w-[40px] text-center border-r project-header relative"
              style={{ backgroundColor: '#6465F0', color: 'white' }}
            >
              {project && !project.isEmpty && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="absolute inset-0 flex items-center justify-center p-1">
                        <div 
                          className="project-code-text text-xs font-bold whitespace-nowrap cursor-pointer"
                          style={{
                            transform: 'rotate(-90deg)',
                            transformOrigin: 'center',
                            width: '60px',
                            height: '60px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white'
                          }}
                        >
                          {project.project_code || project.code || `P${idx + 1}`}
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="text-sm font-medium">
                        {project.name || project.project_name || `Project ${idx + 1}`}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </TableHead>
          );
        })}
      </TableRow>
    </TableHeader>
  );
};
