
import React from 'react';
import { TableHeader, TableRow, TableHead } from '@/components/ui/table';

interface NewResourceTableHeaderProps {
  projects: any[];
}

export const NewResourceTableHeader: React.FC<NewResourceTableHeaderProps> = ({ projects }) => {
  // Calculate the number of project columns to show (minimum 15)
  const projectColumnsCount = Math.max(15, projects.length);
  
  return (
    <TableHeader className="sticky top-0 z-10">
      <TableRow className="h-12" style={{ background: '#6465F0' }}>
        <TableHead className="w-[150px] border-r sticky left-0 z-20 text-white font-semibold" style={{ background: '#6465F0' }}>
          <div className="px-6">Name</div>
        </TableHead>
        <TableHead className="w-16 text-center border-r text-white font-semibold">#</TableHead>
        <TableHead className="w-32 text-center border-r text-white font-semibold">Capacity</TableHead>
        <TableHead className="w-12 text-center border-r text-white font-semibold">AL</TableHead>
        <TableHead className="w-12 text-center border-r text-white font-semibold">HO</TableHead>
        <TableHead className="w-12 text-center border-r text-white font-semibold">OL</TableHead>
        <TableHead className="w-16 text-center border-r text-white font-semibold">Off</TableHead>
        
        {/* Project headers - show all projects or fill to 15 minimum */}
        {Array.from({ length: projectColumnsCount }).map((_, idx) => {
          const project = projects[idx];
          return (
            <TableHead key={project?.id || `empty-${idx}`} className="w-10 text-center border-r">
              <div className="flex items-center justify-center h-full">
                <div 
                  className="text-xs font-bold whitespace-nowrap text-white"
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
                  {project?.code || (project ? `P${idx + 1}` : '')}
                </div>
              </div>
            </TableHead>
          );
        })}
      </TableRow>
    </TableHeader>
  );
};
