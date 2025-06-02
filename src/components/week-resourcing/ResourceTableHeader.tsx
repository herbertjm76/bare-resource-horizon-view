
import React from 'react';
import { TableHeader, TableRow, TableHead } from '@/components/ui/table';

interface ResourceTableHeaderProps {
  projects: any[];
  showRemarks?: boolean;  // Added the showRemarks property as optional
}

export const ResourceTableHeader: React.FC<ResourceTableHeaderProps> = ({ projects, showRemarks = false }) => {
  return (
    <TableHeader className="sticky top-0 z-10 bg-white border-b">
      <TableRow className="h-12">
        {/* Member info cells */}
        <TableHead className="w-48 max-w-48 min-w-32 border-r sticky left-0 z-20 bg-white non-project-column">Name</TableHead>
        <TableHead className="w-12 text-center border-r non-project-column">#</TableHead>
        
        {/* Capacity bar header */}
        <TableHead className="w-24 text-center border-r non-project-column">Capacity</TableHead>
        
        {/* Leave cells - rearranged order */}
        <TableHead className="w-10 text-center border-r non-project-column">AL</TableHead>
        <TableHead className="w-10 text-center border-r non-project-column">HO</TableHead>
        <TableHead className="w-10 text-center border-r non-project-column">OL</TableHead>
        
        {/* Office Location Header */}
        <TableHead className="w-14 text-center border-r non-project-column">Off</TableHead>
        
        {/* Project allocation headers - with enhanced styling and project codes */}
        {projects.map((project, idx) => {
          return (
            <TableHead 
              key={project.id} 
              className="w-10 text-center project-header relative"
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
          <TableHead className="w-40 text-center border-r non-project-column">Remarks</TableHead>
        )}
      </TableRow>
    </TableHeader>
  );
};
