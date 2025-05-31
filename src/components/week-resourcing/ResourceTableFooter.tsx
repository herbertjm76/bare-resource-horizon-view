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
    <TableFooter className="bg-gray-100/80 border-gray-200">
      <TableRow className="bg-gray-100/80 hover:bg-gray-100 border-gray-200">
        {/* Resource Name Column */}
        <TableCell className="font-medium text-gray-700 bg-gray-100/80 border-r border-gray-200">
          Total Hours
        </TableCell>
        
        {/* Project Count Column */}
        <TableCell className="text-center font-medium text-gray-500 bg-gray-100/80 border-r border-gray-200">
          —
        </TableCell>
        
        {/* Capacity Bar Column */}
        <TableCell className="text-center font-medium text-gray-500 bg-gray-100/80 border-r border-gray-200">
          —
        </TableCell>
        
        {/* Annual Leave Column */}
        <TableCell className="text-center font-medium text-gray-500 bg-gray-100/80 border-r border-gray-200">
          —
        </TableCell>
        
        {/* Holiday Column */}
        <TableCell className="text-center font-medium text-gray-500 bg-gray-100/80 border-r border-gray-200">
          —
        </TableCell>
        
        {/* Other Leave Column */}
        <TableCell className="text-center font-medium text-gray-500 bg-gray-100/80 border-r border-gray-200">
          —
        </TableCell>
        
        {/* Office Location Column */}
        <TableCell className="text-center font-medium text-gray-500 bg-gray-100/80 border-r border-gray-200">
          —
        </TableCell>
        
        {/* Project allocation columns */}
        {projectsToRender.map((project) => {
          if (project.isEmpty) {
            return (
              <TableCell 
                key={`footer-empty-${project.id}`} 
                className="text-center font-bold text-lg text-gray-500 bg-gray-100/80 w-[40px] border-r border-gray-200"
              >
                —
              </TableCell>
            );
          }
          
          const total = projectHourTotals.find(p => p.projectId === project.id)?.totalHours || 0;
          
          return (
            <TableCell 
              key={`footer-${project.id}`} 
              className="text-center font-bold text-lg text-gray-700 bg-gray-100/80 w-[40px] border-r border-gray-200"
            >
              {total > 0 ? total : '—'}
            </TableCell>
          );
        })}
      </TableRow>
    </TableFooter>
  );
};
