
import React from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { formatNumber } from '../utils';
import { Project } from '../types';

interface ProjectTotalsRowProps {
  projects: Project[];
  projectTotals: Record<string, number>;
}

export const ProjectTotalsRow: React.FC<ProjectTotalsRowProps> = ({
  projects,
  projectTotals
}) => {
  // Calculate grand total of all project hours
  const grandTotal = Object.values(projectTotals).reduce(
    (sum, hours) => sum + hours, 
    0
  );

  return (
    <TableRow className="bg-muted/20 font-medium border-t-2">
      <TableCell colSpan={2} className="py-2 px-4">
        Project Totals
      </TableCell>

      <TableCell className="py-1 px-1 capacity-column">
        <div className="capacity-display font-bold">
          {formatNumber(grandTotal)}h
        </div>
      </TableCell>

      {/* Skip utilization */}
      <TableCell />
      
      {/* Skip leave columns */}
      <TableCell />
      <TableCell />
      <TableCell />
      <TableCell />
      <TableCell />
      
      {/* Skip remarks column */}
      <TableCell />

      {/* Project totals */}
      {projects.map(project => (
        <TableCell key={project.id} className="py-1 px-1 project-hours-column">
          <div className="table-cell font-bold">
            {projectTotals[project.id] ? `${formatNumber(projectTotals[project.id])}h` : ''}
          </div>
        </TableCell>
      ))}
    </TableRow>
  );
};
