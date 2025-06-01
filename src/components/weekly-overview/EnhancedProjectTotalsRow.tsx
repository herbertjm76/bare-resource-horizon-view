
import React from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
import { Project } from './types';

interface EnhancedProjectTotalsRowProps {
  projects: Project[];
  projectTotals: Record<string, number>;
}

export const EnhancedProjectTotalsRow: React.FC<EnhancedProjectTotalsRowProps> = ({
  projects,
  projectTotals
}) => {
  const totalAllHours = Object.values(projectTotals).reduce((sum, hours) => sum + hours, 0);

  return (
    <TableRow className="enhanced-totals-row">
      <TableCell className="sticky left-0 z-10 bg-inherit font-bold">
        Project Totals
      </TableCell>
      
      {projects.map((project) => (
        <TableCell key={project.id} className="text-center font-semibold">
          {projectTotals[project.id] || 0}h
        </TableCell>
      ))}
      
      <TableCell className="text-center font-bold">
        {totalAllHours}h
      </TableCell>
      
      <TableCell></TableCell>
      <TableCell></TableCell>
      <TableCell></TableCell>
      <TableCell></TableCell>
    </TableRow>
  );
};
