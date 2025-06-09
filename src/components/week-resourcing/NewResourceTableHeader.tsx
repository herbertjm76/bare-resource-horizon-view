
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
      <TableRow className="bg-brand-violet hover:bg-brand-violet/90">
        {/* Sticky Name Column Header */}
        <TableHead className="text-white font-semibold text-center border-r sticky left-0 z-20 bg-brand-violet w-[150px] mobile-name-cell">
          Name
        </TableHead>
        
        <TableHead className="text-white font-semibold text-center border-r w-[32px] mobile-count-cell">
          #
        </TableHead>
        
        <TableHead className="text-white font-semibold text-center border-r w-[80px] mobile-capacity-cell">
          Cap
        </TableHead>
        
        <TableHead className="text-white font-semibold text-center border-r w-[32px] mobile-leave-cell">
          AL
        </TableHead>
        
        <TableHead className="text-white font-semibold text-center border-r w-[32px] mobile-leave-cell">
          HO
        </TableHead>
        
        <TableHead className="text-white font-semibold text-center border-r w-[32px] mobile-leave-cell">
          OL
        </TableHead>
        
        <TableHead className="text-white font-semibold text-center border-r w-[32px] mobile-office-cell">
          Off
        </TableHead>
        
        {/* Project Headers - show all projects or fill to minimum */}
        {Array.from({ length: projectColumnsCount }).map((_, idx) => {
          const project = projects[idx];
          if (project) {
            return (
              <TableHead 
                key={project.id} 
                className="text-white font-semibold text-center border-r w-[40px] mobile-project-cell writing-mode-vertical text-orientation-mixed h-[80px] transform rotate-180"
                title={project.name}
              >
                <div className="transform rotate-180 text-xs truncate max-w-[30px]">
                  {project.project_code || project.name?.substring(0, 4) || 'N/A'}
                </div>
              </TableHead>
            );
          } else {
            return (
              <TableHead 
                key={`empty-${idx}`} 
                className="text-white font-semibold text-center border-r w-[40px] mobile-project-cell"
              />
            );
          }
        })}
      </TableRow>
    </TableHeader>
  );
};
