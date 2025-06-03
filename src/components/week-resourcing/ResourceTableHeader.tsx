
import React from 'react';
import { TableHeader, TableRow, TableHead } from '@/components/ui/table';

interface ResourceTableHeaderProps {
  projects: any[];
  showRemarks?: boolean;  // Added the showRemarks property as optional
}

export const ResourceTableHeader: React.FC<ResourceTableHeaderProps> = ({ projects, showRemarks = false }) => {
  return (
    <TableHeader className="sticky top-0 z-10 bg-white border-b">
      <TableRow className="h-12" style={{ backgroundColor: '#6465F0' }}>
        {/* Member info cells */}
        <TableHead className="w-48 max-w-48 min-w-32 border-r sticky left-0 z-20 non-project-column" style={{ backgroundColor: '#6465F0', color: 'white' }}>Name</TableHead>
        <TableHead className="w-16 text-center border-r non-project-column" style={{ backgroundColor: '#6465F0', color: 'white' }}>#</TableHead>
        
        {/* Capacity bar header - increased width */}
        <TableHead className="w-32 text-center border-r non-project-column" style={{ backgroundColor: '#6465F0', color: 'white' }}>Capacity</TableHead>
        
        {/* Leave cells - rearranged order */}
        <TableHead className="w-12 text-center border-r non-project-column" style={{ backgroundColor: '#6465F0', color: 'white' }}>AL</TableHead>
        <TableHead className="w-12 text-center border-r non-project-column" style={{ backgroundColor: '#6465F0', color: 'white' }}>HO</TableHead>
        <TableHead className="w-12 text-center border-r non-project-column" style={{ backgroundColor: '#6465F0', color: 'white' }}>OL</TableHead>
        
        {/* Office Location Header */}
        <TableHead className="w-16 text-center border-r non-project-column" style={{ backgroundColor: '#6465F0', color: 'white' }}>Off</TableHead>
        
        {/* Project allocation headers - with enhanced styling and project codes */}
        {projects.map((project, idx) => {
          return (
            <TableHead 
              key={project.id} 
              className="w-10 text-center project-header relative"
              style={{ backgroundColor: '#6465F0', color: 'white' }}
            >
              {!project.isEmpty && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div 
                    className="project-code-text text-xs font-bold whitespace-nowrap"
                    style={{
                      transform: 'rotate(-90deg)',
                      transformOrigin: 'center',
                      width: '40px',
                      height: '40px',
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
        
        {/* Add Remarks column if showRemarks is true */}
        {showRemarks && (
          <TableHead className="w-40 text-center border-r non-project-column" style={{ backgroundColor: '#6465F0', color: 'white' }}>Remarks</TableHead>
        )}
      </TableRow>
    </TableHeader>
  );
};
