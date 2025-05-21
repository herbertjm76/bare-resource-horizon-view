
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
      {projects.map((project, index) => {
        const key = `${member.id}:${project.id}`;
        const hours = allocationMap.get(key) || 0;
        
        // Match the same alternating pattern as in the header
        const isEven = index % 2 === 0;
        const bgClass = isEven ? "bg-muted/30" : "bg-muted/10";
        
        return (
          <TableCell 
            key={`${member.id}-${project.id}`} 
            className={`leave-cell text-center border-r p-0 align-middle ${bgClass} w-[40px]`}
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
