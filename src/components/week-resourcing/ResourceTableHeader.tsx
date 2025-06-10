
import React from 'react';
import { TableHeader, TableRow, TableHead } from '@/components/ui/table';

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
        
        <TableHead className="w-12 text-center border-r non-project-column" style={{ backgroundColor: '#6465F0', color: 'white' }}>AL</TableHead>
        <TableHead className="w-12 text-center border-r non-project-column" style={{ backgroundColor: '#6465F0', color: 'white' }}>HO</TableHead>
        <TableHead className="w-12 text-center border-r-4 border-gray-400 non-project-column" style={{ backgroundColor: '#6465F0', color: 'white' }}>OL</TableHead>
        
        {projects.map((project, idx) => {
          return (
            <TableHead 
              key={project.id} 
              className="w-10 text-center project-header relative"
              style={{ backgroundColor: '#6465F0', color: 'white' }}
            >
              {!project.isEmpty && (
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
                    {project.code || `P${idx + 1}`}
                  </div>
                </div>
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
