
import React from 'react';
import { TableHeader, TableRow, TableHead } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';

interface ResourceTableHeaderProps {
  projects: any[];
  showRemarks?: boolean;
}

export const ResourceTableHeader: React.FC<ResourceTableHeaderProps> = ({ projects, showRemarks = false }) => {
  return (
    <TableHeader className="sticky top-0 z-10 bg-white border-b">
      <TableRow className="h-20" style={{ backgroundColor: '#6465F0' }}>
        <TableHead className="w-48 max-w-48 min-w-32 border-r sticky left-0 z-20 non-project-column" style={{ backgroundColor: '#6465F0', color: 'white' }}>Name</TableHead>
        <TableHead className="w-16 text-center border-r non-project-column" style={{ backgroundColor: '#6465F0', color: 'white' }}>#</TableHead>
        
        <TableHead className="w-32 text-center border-r non-project-column" style={{ backgroundColor: '#6465F0', color: 'white' }}>Capacity</TableHead>
        
        <TableHead className="w-12 text-center border-r non-project-column" style={{ backgroundColor: '#6465F0', color: 'white' }}>
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
        <TableHead className="w-12 text-center border-r non-project-column" style={{ backgroundColor: '#6465F0', color: 'white' }}>
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
        <TableHead className="w-12 text-center border-r-4 border-gray-400 non-project-column" style={{ backgroundColor: '#6465F0', color: 'white' }}>OL</TableHead>
        
        {projects.map((project, idx) => {
          return (
            <TableHead 
              key={project.id} 
              className="w-10 text-center project-header relative"
              style={{ backgroundColor: '#6465F0', color: 'white' }}
            >
              {!project.isEmpty && (
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
                          {project.code || `P${idx + 1}`}
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
        
        {showRemarks && (
          <TableHead className="w-40 text-center border-r non-project-column" style={{ backgroundColor: '#6465F0', color: 'white' }}>Remarks</TableHead>
        )}
      </TableRow>
    </TableHeader>
  );
};
