
import React from 'react';
import { TableHeader, TableRow, TableHead } from '@/components/ui/table';

interface NewResourceTableHeaderProps {
  projects: any[];
}

export const NewResourceTableHeader: React.FC<NewResourceTableHeaderProps> = ({ projects }) => {
  return (
    <TableHeader className="sticky top-0 z-10">
      <TableRow className="h-12" style={{ background: 'linear-gradient(135deg, #6F4BF6 0%, #8b5cf6 100%)' }}>
        <TableHead className="w-[70%] border-r sticky left-0 z-20 text-white font-semibold" style={{ background: 'linear-gradient(135deg, #6F4BF6 0%, #8b5cf6 100%)' }}>Name</TableHead>
        <TableHead className="w-16 text-center border-r text-white font-semibold">#</TableHead>
        <TableHead className="w-32 text-center border-r text-white font-semibold">Capacity</TableHead>
        <TableHead className="w-12 text-center border-r text-white font-semibold">AL</TableHead>
        <TableHead className="w-12 text-center border-r text-white font-semibold">HO</TableHead>
        <TableHead className="w-12 text-center border-r text-white font-semibold">OL</TableHead>
        <TableHead className="w-16 text-center border-r text-white font-semibold">Off</TableHead>
        
        {/* Project headers */}
        {projects.slice(0, 15).map((project, idx) => (
          <TableHead key={project.id} className="w-10 text-center border-r">
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
                {project.code || `P${idx + 1}`}
              </div>
            </div>
          </TableHead>
        ))}
        
        {/* Fill empty project columns if less than 15 */}
        {Array.from({ length: Math.max(0, 15 - projects.length) }).map((_, idx) => (
          <TableHead key={`empty-${idx}`} className="w-10 text-center border-r">
            <div className="h-10"></div>
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
};
