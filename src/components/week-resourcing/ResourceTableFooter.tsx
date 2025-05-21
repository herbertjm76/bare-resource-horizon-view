
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';

interface ResourceTableFooterProps {
  projects: any[];
  projectTotals: Map<string, number>;
}

export const ResourceTableFooter: React.FC<ResourceTableFooterProps> = ({
  projects,
  projectTotals
}) => {
  const totalHours = Array.from(projectTotals.values()).reduce((sum, hours) => sum + hours, 0);

  return (
    <TableRow className="bg-muted/30 font-medium h-10 border-t">
      <TableCell className="sticky-column sticky-left-0 border-r font-semibold pl-2 py-1 text-center">Totals</TableCell>
      <TableCell className="sticky-column sticky-left-12 border-r text-center py-1"></TableCell>
      <TableCell className="sticky-column sticky-left-24 border-r text-center py-1"></TableCell>
      <TableCell className="sticky-column sticky-left-36 border-r text-center py-1"></TableCell>
      <TableCell className="text-center border-r py-1"></TableCell>
      <TableCell className="text-center border-r py-1"></TableCell>
      <TableCell className="text-center border-r py-1"></TableCell>
      <TableCell className="text-center border-r py-1"></TableCell>
      
      {projects.map(project => (
        <TableCell key={`total-${project.id}`} className="text-center border-r py-1">
          {projectTotals.get(project.id) || 0}
        </TableCell>
      ))}
      
      <TableCell className="text-center py-1 font-semibold">
        {totalHours}
      </TableCell>
    </TableRow>
  );
};
