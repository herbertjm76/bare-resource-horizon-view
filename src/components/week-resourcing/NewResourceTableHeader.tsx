
import React from 'react';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface NewResourceTableHeaderProps {
  projects: any[];
}

export const NewResourceTableHeader: React.FC<NewResourceTableHeaderProps> = ({ projects }) => {
  // Calculate the number of project columns to show (minimum 15)
  const projectColumnsCount = Math.max(15, projects.length);

  return (
    <TableHeader>
      <TableRow className="bg-[#6465F0] hover:bg-[#6465F0]/90">
        {/* Sticky Name Column Header */}
        <TableHead className="text-white font-semibold text-center border-r sticky left-0 z-10 bg-[#6465F0] min-w-[120px] max-w-[150px]">
          Name
        </TableHead>
        
        <TableHead className="text-white font-semibold text-center border-r w-[32px] bg-[#6465F0]">
          #
        </TableHead>
        
        <TableHead className="text-white font-semibold text-center border-r w-[80px] bg-[#6465F0]">
          Cap
        </TableHead>
        
        <TableHead className="text-white font-semibold text-center border-r w-[32px] bg-[#6465F0]">
          AL
        </TableHead>
        
        <TableHead className="text-white font-semibold text-center border-r w-[32px] bg-[#6465F0]">
          HO
        </TableHead>
        
        <TableHead className="text-white font-semibold text-center border-r w-[32px] bg-[#6465F0]">
          OL
        </TableHead>
        
        <TableHead className="text-white font-semibold text-center border-r w-[32px] bg-[#6465F0]">
          Off
        </TableHead>
        
        {/* Project Headers - show all projects or fill to minimum */}
        {Array.from({ length: projectColumnsCount }).map((_, idx) => {
          const project = projects[idx];
          if (project) {
            return (
              <TableHead 
                key={project.id} 
                className="text-white font-semibold text-center border-r w-[40px] bg-[#6465F0] relative"
                style={{ height: '80px' }}
                title={project.name}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div 
                    className="text-xs font-bold whitespace-nowrap"
                    style={{
                      transform: 'rotate(-90deg)',
                      transformOrigin: 'center',
                      width: '60px',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {project.project_code || project.name?.substring(0, 4) || 'N/A'}
                  </div>
                </div>
              </TableHead>
            );
          } else {
            return (
              <TableHead 
                key={`empty-${idx}`} 
                className="text-white font-semibold text-center border-r w-[40px] bg-[#6465F0]"
              />
            );
          }
        })}
      </TableRow>
    </TableHeader>
  );
};
