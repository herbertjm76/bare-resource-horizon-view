
import React from 'react';
import { TableFooter, TableRow, TableCell } from '@/components/ui/table';

interface ResourceTableFooterProps {
  projects: any[];
  projectTotals: Map<string, number>;
}

export const ResourceTableFooter: React.FC<ResourceTableFooterProps> = ({
  projects,
  projectTotals
}) => {
  return (
    <TableFooter>
      <TableRow className="bg-muted/20 font-medium">
        {/* First column - Total label */}
        <TableCell 
          colSpan={4} 
          className="sticky-column sticky-left-0 border-r border-t bg-muted/30 z-20 text-brand-primary"
        >
          Total Hours Per Project
        </TableCell>
        
        {/* Leave columns - empty cells */}
        <TableCell className="border-r border-t text-center">-</TableCell>
        <TableCell className="border-r border-t text-center">-</TableCell>
        
        {/* Project columns - show totals for each */}
        {projects.map((project, index) => {
          // Get the total hours for this project
          const totalHours = projectTotals.get(project.id) || 0;
          
          // Apply same alternating pattern
          const isEven = index % 2 === 0;
          const bgClass = isEven ? "bg-muted/30" : "bg-muted/10";
          
          return (
            <TableCell 
              key={project.id} 
              className={`${bgClass} border-r border-t text-center font-bold`}
            >
              {totalHours}
            </TableCell>
          );
        })}
      </TableRow>
    </TableFooter>
  );
};
