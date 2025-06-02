
import React from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
import { Project } from './types';

interface CleanProjectTotalsRowProps {
  projects: Project[];
  projectTotals: Record<string, number>;
}

export const CleanProjectTotalsRow: React.FC<CleanProjectTotalsRowProps> = ({
  projects,
  projectTotals
}) => {
  const grandTotal = Object.values(projectTotals).reduce((sum, total) => sum + total, 0);

  return (
    <TableRow>
      <TableCell className="font-bold text-left">TOTAL HOURS</TableCell>
      
      {projects.map((project) => (
        <TableCell key={project.id} className="font-bold">
          {projectTotals[project.id] || 0}
        </TableCell>
      ))}
      
      <TableCell className="font-bold">{grandTotal}</TableCell>
      <TableCell>—</TableCell>
      <TableCell>—</TableCell>
      <TableCell>—</TableCell>
      <TableCell>—</TableCell>
    </TableRow>
  );
};
