
import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';

interface NewResourceSummaryRowProps {
  projects: any[];
  allocationMap: Map<string, number>;
  members: any[];
}

export const NewResourceSummaryRow: React.FC<NewResourceSummaryRowProps> = ({
  projects,
  allocationMap,
  members
}) => {
  // Calculate total hours across all projects
  let totalHours = 0;
  allocationMap.forEach((hours) => {
    totalHours += hours;
  });

  // Calculate project totals
  const projectTotals = projects.map(project => {
    let projectTotal = 0;
    
    members.forEach(member => {
      const key = `${member.id}:${project.id}`;
      const hours = allocationMap.get(key) || 0;
      projectTotal += hours;
    });
    
    return {
      projectId: project.id,
      totalHours: projectTotal
    };
  });

  return (
    <TableRow className="bg-gray-100 font-medium border-t-2 border-gray-300">
      {/* Team Member Column */}
      <TableCell className="sticky left-0 bg-gray-100 z-20 text-sm font-semibold">
        Weekly Total
      </TableCell>
      
      {/* Utilization Column */}
      <TableCell className="text-center text-sm font-semibold">
        —
      </TableCell>
      
      {/* Leave Column */}
      <TableCell className="text-center text-sm font-semibold">
        —
      </TableCell>
      
      {/* Project Count Column */}
      <TableCell className="text-center text-sm font-semibold">
        {totalHours}h
      </TableCell>
      
      {/* Project Columns */}
      {projects.map((project) => {
        const projectData = projectTotals.find(pt => pt.projectId === project.id);
        const hours = projectData?.totalHours || 0;
        
        return (
          <TableCell key={project.id} className="text-center text-sm font-semibold">
            {hours > 0 ? `${hours}h` : '—'}
          </TableCell>
        );
      })}
    </TableRow>
  );
};
