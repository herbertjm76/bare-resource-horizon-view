
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
  const getProjectTotal = (projectId: string) => {
    let total = 0;
    members.forEach(member => {
      const key = `${member.id}:${projectId}`;
      total += allocationMap.get(key) || 0;
    });
    return total;
  };

  const getTotalHours = () => {
    let total = 0;
    allocationMap.forEach(hours => {
      total += hours;
    });
    return total;
  };

  return (
    <TableRow className="bg-slate-100 font-semibold border-t-2 border-slate-300">
      <TableCell className="text-center sticky left-0 bg-slate-100 z-10">
        T
      </TableCell>
      <TableCell className="sticky left-12 bg-slate-100 z-10">
        Total
      </TableCell>
      <TableCell className="text-center">
        -
      </TableCell>
      <TableCell className="text-center">
        -
      </TableCell>
      <TableCell className="text-center">
        {members.length}
      </TableCell>
      <TableCell className="text-center">
        {getTotalHours()}
      </TableCell>
      {projects.map((project) => (
        <TableCell 
          key={project.id} 
          className="text-center border-l border-slate-200"
        >
          {getProjectTotal(project.id) || '—'}
        </TableCell>
      ))}
    </TableRow>
  );
};
