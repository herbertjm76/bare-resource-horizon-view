
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
    <TableRow className="font-semibold bg-gray-100/80 border-gray-200 hover:bg-gray-100">
      <TableCell className="py-2.5 px-4 text-gray-700 border-r border-gray-200">
        Total
      </TableCell>
      
      {/* Skip these columns in the totals row */}
      <TableCell className="text-center text-gray-500 border-r border-gray-200">—</TableCell>
      <TableCell className="text-center text-gray-500 border-r border-gray-200">—</TableCell>
      <TableCell className="text-center text-gray-500 border-r border-gray-200">—</TableCell>
      <TableCell className="text-center text-gray-500 border-r border-gray-200">—</TableCell>
      <TableCell className="text-center text-gray-500 border-r border-gray-200">—</TableCell>
      <TableCell className="text-center text-gray-500 border-r border-gray-200">—</TableCell>
      <TableCell className="text-center text-gray-500 border-r border-gray-200">—</TableCell>
      <TableCell className="text-center text-gray-500 border-r border-gray-200">—</TableCell>
      
      <TableCell className="py-2.5 px-4 text-right font-bold text-gray-800 border-r border-gray-200">
        {formatNumber(grandTotal)}h
      </TableCell>
      
      {/* Project total columns */}
      {projects.map(project => (
        <TableCell key={project.id} className="py-2.5 px-1 text-center font-semibold text-gray-700 border-r border-gray-200">
          {projectTotals[project.id] ? `${formatNumber(projectTotals[project.id])}h` : '—'}
        </TableCell>
      ))}
    </TableRow>
  );
};
