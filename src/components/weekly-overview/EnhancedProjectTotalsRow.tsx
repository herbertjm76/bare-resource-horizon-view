
import React from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
import { formatNumber } from './utils';
import { Project } from './types';

interface EnhancedProjectTotalsRowProps {
  projects: Project[];
  projectTotals: Record<string, number>;
}

export const EnhancedProjectTotalsRow: React.FC<EnhancedProjectTotalsRowProps> = ({
  projects,
  projectTotals
}) => {
  // Calculate grand total
  const grandTotal = Object.values(projectTotals).reduce((sum, total) => sum + total, 0);
  
  return (
    <TableRow className="enhanced-totals-row">
      <TableCell className="py-3 px-4 font-semibold">
        Total Hours
      </TableCell>
      
      {/* Skip these columns in the totals row */}
      <TableCell className="text-center">—</TableCell>
      <TableCell className="text-center">—</TableCell>
      <TableCell className="text-center">—</TableCell>
      <TableCell className="text-center">—</TableCell>
      <TableCell className="text-center">—</TableCell>
      <TableCell className="text-center">—</TableCell>
      <TableCell className="text-center">—</TableCell>
      <TableCell className="text-center">—</TableCell>
      
      <TableCell className="py-3 px-4 text-right font-bold">
        {formatNumber(grandTotal)}h
      </TableCell>
      
      {/* Project total columns */}
      {projects.map(project => (
        <TableCell key={project.id} className="py-3 px-1 text-center font-semibold">
          {projectTotals[project.id] ? `${formatNumber(projectTotals[project.id])}h` : '—'}
        </TableCell>
      ))}
    </TableRow>
  );
};
