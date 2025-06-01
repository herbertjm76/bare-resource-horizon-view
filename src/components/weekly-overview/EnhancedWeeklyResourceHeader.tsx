
import React from 'react';
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Project } from './types';

interface EnhancedWeeklyResourceHeaderProps {
  projects: Project[];
}

export const EnhancedWeeklyResourceHeader: React.FC<EnhancedWeeklyResourceHeaderProps> = ({
  projects
}) => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="sticky left-0 z-20 bg-inherit min-w-[200px]">
          Team Member
        </TableHead>
        
        {projects.map((project) => (
          <TableHead key={project.id} className="text-center min-w-[80px]">
            <div className="enhanced-project-code-header">
              <span className="text-white font-bold">
                {project.code}
              </span>
            </div>
          </TableHead>
        ))}
        
        <TableHead className="text-center min-w-[80px]">Total</TableHead>
        <TableHead className="text-center min-w-[80px]">Capacity</TableHead>
        <TableHead className="text-center min-w-[100px]">Utilization</TableHead>
        <TableHead className="text-center min-w-[80px]">Leave</TableHead>
        <TableHead className="text-center min-w-[150px]">Remarks</TableHead>
      </TableRow>
    </TableHeader>
  );
};
