
import React from 'react';
import { TableCell } from '@/components/ui/table';
import { ResourceAllocationCell } from '../ResourceAllocationCell';

interface ProjectAllocationCellsProps {
  projects: any[];
  member: any;
  allocationMap: Map<string, number>;
  weekStartDate: string;
}

export const ProjectAllocationCells: React.FC<ProjectAllocationCellsProps> = ({
  projects,
  member,
  allocationMap,
  weekStartDate
}) => {
  return (
    <>
      {projects.map(project => {
        const key = `${member.id}:${project.id}`;
        const hours = allocationMap.get(key) || 0;
        
        // For debugging
        if (project.name.includes('HERB')) {
          console.log(`Project HERB allocation for ${member.first_name}: ${hours} hours`);
        }
        
        return (
          <TableCell 
            key={`${member.id}-${project.id}`} 
            className="leave-cell text-center border-r p-0 align-middle"
          >
            <ResourceAllocationCell 
              hours={hours}
              resourceId={member.id}
              projectId={project.id}
              weekStartDate={weekStartDate}
            />
          </TableCell>
        );
      })}
    </>
  );
};
