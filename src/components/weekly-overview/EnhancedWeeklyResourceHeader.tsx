
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
      <TableRow className="bg-[#6465F0] hover:bg-[#6465F0]">
        <TableHead className="bg-[#6465F0]">
          <span className="text-white font-bold text-center block">
            TEAM MEMBER
          </span>
        </TableHead>
        
        {projects.map((project) => (
          <TableHead key={project.id} className="bg-[#6465F0]">
            <div className="enhanced-project-code-header">
              <span className="text-white font-bold">
                {project.code}
              </span>
            </div>
          </TableHead>
        ))}
        
        <TableHead className="bg-[#6465F0]">
          <span className="text-white font-bold">TOTAL</span>
        </TableHead>
        <TableHead className="bg-[#6465F0]">
          <span className="text-white font-bold">CAPACITY</span>
        </TableHead>
        <TableHead className="bg-[#6465F0]">
          <span className="text-white font-bold">UTILIZATION</span>
        </TableHead>
        <TableHead className="bg-[#6465F0]">
          <span className="text-white font-bold">LEAVE</span>
        </TableHead>
        <TableHead className="bg-[#6465F0]">
          <span className="text-white font-bold">REMARKS</span>
        </TableHead>
      </TableRow>
    </TableHeader>
  );
};
