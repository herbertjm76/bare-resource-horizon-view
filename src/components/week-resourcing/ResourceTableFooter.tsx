
import React from 'react';
import { TableCell, TableFooter, TableRow } from '@/components/ui/table';

interface ProjectTotal {
  projectId: string;
  totalHours: number;
}

interface ResourceTableFooterProps {
  projects: any[];
  projectHourTotals: ProjectTotal[];
}

export const ResourceTableFooter: React.FC<ResourceTableFooterProps> = ({ 
  projects, 
  projectHourTotals 
}) => {
  // Ensure we always show at least 15 project columns
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
    <TableFooter>
      <TableRow className="bg-muted/30 font-medium">
        {/* Name column - displays "Total" */}
        <TableCell className="sticky-column sticky-left-0 border-r text-center w-[150px] non-project-column">Total</TableCell>
        
        {/* Empty cells for the fixed columns */}
        <TableCell className="border-r non-project-column"></TableCell>
        <TableCell className="border-r non-project-column"></TableCell>
        <TableCell className="border-r non-project-column"></TableCell>
        <TableCell className="border-r non-project-column"></TableCell>
        <TableCell className="border-r non-project-column"></TableCell>
        <TableCell className="border-r non-project-column"></TableCell>

        {/* Project total cells */}
        {projectsToRender.map((project, index) => {
          if (project.isEmpty) {
            return (
              <TableCell 
                key={`total-empty-${index}`} 
                className="border-r text-center project-column-cell"
              ></TableCell>
            );
          }
          
          const projectTotal = projectHourTotals.find(pt => pt.projectId === project.id);
          const totalHours = projectTotal ? projectTotal.totalHours : 0;
          
          return (
            <TableCell 
              key={`total-${project.id}`} 
              className="border-r text-center font-medium project-column-cell"
            >
              {totalHours > 0 ? totalHours : '-'}
            </TableCell>
          );
        })}
      </TableRow>
    </TableFooter>
  );
};
