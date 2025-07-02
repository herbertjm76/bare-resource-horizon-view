
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
  console.log('NewResourceSummaryRow - Allocation Map:', {
    mapSize: allocationMap.size,
    allEntries: Array.from(allocationMap.entries()),
    projectsCount: projects.length,
    membersCount: members.length
  });

  // Calculate total hours across all projects
  let totalHours = 0;
  allocationMap.forEach((hours) => {
    console.log(`Adding ${hours}h from allocation, running total: ${totalHours + hours}h`);
    totalHours += hours;
  });

  console.log('Final total hours across all allocations:', totalHours);

  // Calculate project totals
  const projectTotals = projects.map(project => {
    let projectTotal = 0;
    
    members.forEach(member => {
      const key = `${member.id}:${project.id}`;
      const hours = allocationMap.get(key) || 0;
      console.log(`Project ${project.id} - Member ${member.id}: ${hours}h (running total: ${projectTotal + hours}h)`);
      projectTotal += hours;
    });
    
    console.log(`Final project total for ${project.id}: ${projectTotal}`);
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
      
      {/* Weekly Utilization Column - removed */}
      
      {/* Leave Column - removed */}
      
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
