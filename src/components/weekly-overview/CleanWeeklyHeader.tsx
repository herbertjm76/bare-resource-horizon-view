
import React from 'react';
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Project } from './types';
import { useProjectDisplayText } from '@/hooks/useProjectDisplayText';

interface CleanWeeklyHeaderProps {
  projects: Project[];
}

export const CleanWeeklyHeader: React.FC<CleanWeeklyHeaderProps> = ({ projects }) => {
  const { getDisplayText, getTooltipText } = useProjectDisplayText();
  
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="text-center">
          TEAM MEMBER
        </TableHead>
        
        {projects.map((project) => (
          <TableHead key={project.id}>
            <div className="weekly-project-header" title={getTooltipText(project)}>
              {getDisplayText(project)}
            </div>
          </TableHead>
        ))}
        
        <TableHead className="text-center">TOTAL</TableHead>
        <TableHead className="text-center">CAPACITY</TableHead>
        <TableHead className="text-center">UTILIZATION</TableHead>
        <TableHead className="text-center">LEAVE</TableHead>
        <TableHead className="text-center">REMARKS</TableHead>
      </TableRow>
    </TableHeader>
  );
};
