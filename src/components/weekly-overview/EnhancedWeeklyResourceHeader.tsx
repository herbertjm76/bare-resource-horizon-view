
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
        <TableHead>
          <span className="text-white font-bold text-center block">
            TEAM MEMBER
          </span>
        </TableHead>
        
        {projects.map((project) => (
          <TableHead key={project.id}>
            <div className="enhanced-project-code-header">
              <span className="text-white font-bold">
                {project.code}
              </span>
            </div>
          </TableHead>
        ))}
        
        <TableHead>
          <span className="text-white font-bold">TOTAL</span>
        </TableHead>
        <TableHead>
          <span className="text-white font-bold">CAPACITY</span>
        </TableHead>
        <TableHead>
          <span className="text-white font-bold">UTILIZATION</span>
        </TableHead>
        <TableHead>
          <span className="text-white font-bold">LEAVE</span>
        </TableHead>
        <TableHead>
          <span className="text-white font-bold">REMARKS</span>
        </TableHead>
      </TableRow>
    </TableHeader>
  );
};
