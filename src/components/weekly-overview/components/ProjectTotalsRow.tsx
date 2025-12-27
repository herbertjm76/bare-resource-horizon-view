
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
    <TableRow className="font-semibold bg-muted/80 border-border hover:bg-muted">
      <TableCell className="py-2.5 px-4 text-foreground border-r border-border">
        Total
      </TableCell>
      
      {/* Skip these columns in the totals row */}
      <TableCell className="text-center text-muted-foreground border-r border-border">—</TableCell>
      <TableCell className="text-center text-muted-foreground border-r border-border">—</TableCell>
      <TableCell className="text-center text-muted-foreground border-r border-border">—</TableCell>
      <TableCell className="text-center text-muted-foreground border-r border-border">—</TableCell>
      <TableCell className="text-center text-muted-foreground border-r border-border">—</TableCell>
      <TableCell className="text-center text-muted-foreground border-r border-border">—</TableCell>
      <TableCell className="text-center text-muted-foreground border-r border-border">—</TableCell>
      <TableCell className="text-center text-muted-foreground border-r border-border">—</TableCell>
      
      <TableCell className="py-2.5 px-4 text-right font-bold text-foreground border-r border-border">
        {formatNumber(grandTotal)}h
      </TableCell>
      
      {/* Project total columns */}
      {projects.map(project => (
        <TableCell key={project.id} className="py-2.5 px-1 text-center font-semibold text-foreground border-r border-border">
          {projectTotals[project.id] ? `${formatNumber(projectTotals[project.id])}h` : '—'}
        </TableCell>
      ))}
    </TableRow>
  );
};
