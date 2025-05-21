
import React from 'react';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface ResourceTableHeaderProps {
  projects: any[];
  showRemarks?: boolean;
}

export const ResourceTableHeader: React.FC<ResourceTableHeaderProps> = ({ 
  projects,
  showRemarks = true 
}) => {
  return (
    <TableHeader>
      <TableRow className="border-b">
        {/* Fixed columns */}
        <TableHead className="sticky-column sticky-left-0 min-w-[160px] bg-muted/20 border-r z-20">Name</TableHead>
        <TableHead className="sticky-column sticky-left-12 w-10 bg-muted/20 border-r z-20 text-center">#</TableHead>
        <TableHead className="sticky-column sticky-left-24 w-10 bg-muted/20 border-r z-20 text-center">Office</TableHead>
        <TableHead className="sticky-column sticky-left-36 w-[120px] bg-muted/20 border-r z-20 text-center">Capacity</TableHead>
        
        {/* Leave columns */}
        <TableHead className="bg-muted/20 border-r text-center w-[80px]">Annual<br />Leave</TableHead>
        <TableHead className="bg-muted/20 border-r text-center w-[120px]">Other<br />Leave</TableHead>

        {/* Project columns - dynamically generated */}
        {projects.map((project: any) => (
          <TableHead 
            key={project.id} 
            className="bg-muted/20 border-r text-center min-w-[80px]"
            title={project.name}
          >
            {project.code || project.name.substring(0, 3).toUpperCase()}
          </TableHead>
        ))}
        
        {/* Total column */}
        <TableHead className="bg-muted/20 text-center min-w-[80px]">Total</TableHead>
      </TableRow>
    </TableHeader>
  );
};
