
import React from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
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
  // Calculate grand total
  const grandTotal = Object.values(projectTotals).reduce((sum, total) => sum + total, 0);
  
  return (
    <TableRow className="font-semibold bg-brand-primary/10">
      <TableCell className="py-2 px-4">
        Total
      </TableCell>
      
      {/* Skip these columns in the totals row */}
      <TableCell></TableCell>
      <TableCell></TableCell>
      <TableCell></TableCell>
      <TableCell></TableCell>
      <TableCell></TableCell>
      <TableCell></TableCell>
      <TableCell></TableCell>
      <TableCell></TableCell>
      
      <TableCell className="py-2 px-4 text-right">
        {formatNumber(grandTotal)}h
      </TableCell>
      
      {/* Project total columns */}
      {projects.map(project => (
        <TableCell key={project.id} className="py-2 px-1 text-center">
          {projectTotals[project.id] ? `${formatNumber(projectTotals[project.id])}h` : ''}
        </TableCell>
      ))}
    </TableRow>
  );
};
