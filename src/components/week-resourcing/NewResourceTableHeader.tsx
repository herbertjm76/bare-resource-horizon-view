
import React from 'react';
import { TableHeader, TableRow, TableHead } from '@/components/ui/table';

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
          AL
        </TableHead>
        <TableHead className="w-12 text-center border-r font-semibold" style={{ backgroundColor: '#6465F0', color: 'white' }}>
          HO
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
                <div className="absolute inset-0 flex items-center justify-center p-1">
                  <div 
                    className="project-code-text text-xs font-bold whitespace-nowrap"
                    style={{
                      transform: 'rotate(-90deg)',
                      transformOrigin: 'center',
                      width: '60px',
                      height: '60px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {project.project_code || project.code || `P${idx + 1}`}
                  </div>
                </div>
              )}
            </TableHead>
          );
        })}
      </TableRow>
    </TableHeader>
  );
};
