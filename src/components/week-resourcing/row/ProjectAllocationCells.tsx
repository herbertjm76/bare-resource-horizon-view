
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
          // Match the same alternating pattern as in the header
          const isEven = index % 2 === 0;
          const bgClass = isEven ? "bg-muted/30" : "bg-muted/10";
          
          return (
            <TableCell 
              key={`${member.id}-empty-${index}`} 
              className={`leave-cell text-center border-r p-0 align-middle ${bgClass} w-[40px]`}
            />
          );
        }
        
        const key = `${member.id}:${project.id}`;
        const hours = allocationMap.get(key) || 0;
        
        // Match the same alternating pattern as in the header
        const isEven = index % 2 === 0;
        // Use more distinct styling for project columns
        const bgClass = isEven ? "bg-brand-violet-light/30" : "bg-brand-violet-light/10";
        
        // Add a thicker border between every third project
        const borderClass = (index + 1) % 3 === 0 ? "border-r-2 border-r-brand-violet/20" : "border-r";
        
        return (
          <TableCell 
            key={`${member.id}-${project.id}`} 
            className={`leave-cell text-center p-0 align-middle ${bgClass} ${borderClass} w-[40px]`}
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
