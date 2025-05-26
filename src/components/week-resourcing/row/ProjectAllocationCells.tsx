
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
        // If this is an empty project placeholder, render an empty cell
        if (project.isEmpty) {
          return (
            <TableCell 
              key={`${member.id}-empty-${index}`} 
              className="leave-cell text-center border-r p-0 align-middle project-column-cell w-[40px]"
            />
          );
        }
        
        const key = `${member.id}:${project.id}`;
        const hours = allocationMap.get(key) || 0;
        
        return (
          <TableCell 
            key={`${member.id}-${project.id}`} 
            className="leave-cell text-center p-0 align-middle project-column-cell w-[40px]"
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
