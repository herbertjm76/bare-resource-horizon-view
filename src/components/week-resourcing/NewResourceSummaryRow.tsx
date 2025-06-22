
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
    // Sum all hours from the allocation map
    allocationMap.forEach(hours => {
      total += hours;
    });
    return total;
  };

  const getGrandTotalMembers = () => {
    // Count unique members who have any allocations
    const membersWithAllocations = new Set<string>();
    allocationMap.forEach((hours, key) => {
      if (hours > 0) {
        const [memberId] = key.split(':');
        membersWithAllocations.add(memberId);
      }
    });
    return membersWithAllocations.size;
  };

  return (
    <TableRow className="bg-slate-100 font-semibold border-t-2 border-slate-300">
      <TableCell className="text-center sticky left-0 bg-slate-100 z-10">
        T
      </TableCell>
      <TableCell className="sticky left-12 bg-slate-100 z-10">
        Weekly Total
      </TableCell>
      <TableCell className="text-center">
        —
      </TableCell>
      <TableCell className="text-center">
        {getGrandTotalMembers()} / {members.length}
      </TableCell>
      <TableCell className="text-center font-bold text-lg">
        {getTotalHours()}h
      </TableCell>
      {projects.map((project) => {
        const projectTotal = getProjectTotal(project.id);
        return (
          <TableCell 
            key={project.id} 
            className="text-center border-l border-slate-200 font-bold"
          >
            {projectTotal > 0 ? `${projectTotal}h` : '—'}
          </TableCell>
        );
      })}
    </TableRow>
  );
};
