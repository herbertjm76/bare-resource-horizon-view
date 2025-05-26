import React from 'react';
import { TableRow, TableCell, TableFooter } from '@/components/ui/table';

interface ProjectHourTotal {
  projectId: string;
  totalHours: number;
}

interface ResourceTableFooterProps {
  projects: any[];
  projectHourTotals: ProjectHourTotal[];
}

export const ResourceTableFooter: React.FC<ResourceTableFooterProps> = ({
  projects,
  projectHourTotals
}) => {
  // Calculate grand total
  const grandTotal = projectHourTotals.reduce((sum, project) => sum + project.totalHours, 0);
  
  // Ensure we show totals for at least 15 project columns
  const minProjectsToShow = 15;
  const projectsToRender = [...projects];
  
  // Add empty placeholders if we have less than 15 projects
  if (projects.length < minProjectsToShow) {
    const emptyProjectsNeeded = minProjectsToShow - projects.length;
    for (let i = 0; i < emptyProjectsNeeded; i++) {
      projectsToRender.push({
        id: `empty-project-${i}`,
        isEmpty: true
      });
    }
  }

  return (
    <TableFooter className="bg-brand-primary text-white">
      <TableRow className="bg-brand-primary hover:bg-brand-primary">
        {/* Resource Name Column */}
        <TableCell className="font-medium text-white bg-brand-primary">
          Total Hours
        </TableCell>
        
        {/* Project Count Column */}
        <TableCell className="text-center font-medium text-white bg-brand-primary">
          —
        </TableCell>
        
        {/* Capacity Bar Column */}
        <TableCell className="text-center font-medium text-white bg-brand-primary">
          —
        </TableCell>
        
        {/* Annual Leave Column */}
        <TableCell className="text-center font-medium text-white bg-brand-primary">
          —
        </TableCell>
        
        {/* Holiday Column */}
        <TableCell className="text-center font-medium text-white bg-brand-primary">
          —
        </TableCell>
        
        {/* Other Leave Column */}
        <TableCell className="text-center font-medium text-white bg-brand-primary">
          —
        </TableCell>
        
        {/* Office Location Column */}
        <TableCell className="text-center font-medium text-white bg-brand-primary">
          —
        </TableCell>
        
        {/* Project allocation columns */}
        {projectsToRender.map((project) => {
          if (project.isEmpty) {
            return (
              <TableCell 
                key={`footer-empty-${project.id}`} 
                className="text-center font-bold text-lg text-white bg-brand-primary w-[40px]"
              >
                —
              </TableCell>
            );
          }
          
          const total = projectHourTotals.find(p => p.projectId === project.id)?.totalHours || 0;
          
          return (
            <TableCell 
              key={`footer-${project.id}`} 
              className="text-center font-bold text-lg text-white bg-brand-primary w-[40px]"
            >
              {total > 0 ? total : '—'}
            </TableCell>
          );
        })}
      </TableRow>
    </TableFooter>
  );
};
