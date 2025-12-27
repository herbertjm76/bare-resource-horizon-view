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
    <TableFooter className="bg-muted/80 border-border">
      <TableRow className="bg-muted/80 hover:bg-muted border-border">
        {/* Resource Name Column */}
        <TableCell className="font-medium text-foreground bg-muted/80 border-r border-border">
          Total Hours
        </TableCell>
        
        {/* Project Count Column */}
        <TableCell className="text-center font-medium text-muted-foreground bg-muted/80 border-r border-border">
          —
        </TableCell>
        
        {/* Capacity Bar Column */}
        <TableCell className="text-center font-medium text-muted-foreground bg-muted/80 border-r border-border">
          —
        </TableCell>
        
        {/* Annual Leave Column */}
        <TableCell className="text-center font-medium text-muted-foreground bg-muted/80 border-r border-border">
          —
        </TableCell>
        
        {/* Holiday Column */}
        <TableCell className="text-center font-medium text-muted-foreground bg-muted/80 border-r border-border">
          —
        </TableCell>
        
        {/* Other Leave Column */}
        <TableCell className="text-center font-medium text-muted-foreground bg-muted/80 border-r border-border">
          —
        </TableCell>
        
        {/* Office Location Column */}
        <TableCell className="text-center font-medium text-muted-foreground bg-muted/80 border-r border-border">
          —
        </TableCell>
        
        {/* Project allocation columns */}
        {projectsToRender.map((project) => {
          if (project.isEmpty) {
            return (
              <TableCell 
                key={`footer-empty-${project.id}`} 
                className="text-center font-bold text-lg text-muted-foreground bg-muted/80 w-[40px] border-r border-border"
              >
                —
              </TableCell>
            );
          }
          
          const total = projectHourTotals.find(p => p.projectId === project.id)?.totalHours || 0;
          
          return (
            <TableCell 
              key={`footer-${project.id}`} 
              className="text-center font-bold text-lg text-foreground bg-muted/80 w-[40px] border-r border-border"
            >
              {total > 0 ? total : '—'}
            </TableCell>
          );
        })}
      </TableRow>
    </TableFooter>
  );
};
