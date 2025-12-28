
import React from 'react';
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Project } from './types';
import { useProjectDisplayText } from '@/hooks/useProjectDisplayText';

interface EnhancedWeeklyResourceHeaderProps {
  projects: Project[];
}

export const EnhancedWeeklyResourceHeader: React.FC<EnhancedWeeklyResourceHeaderProps> = ({
  projects
}) => {
  const getDisplayText = useProjectDisplayText();
  
  return (
    <TableHeader>
      <TableRow style={{ background: 'hsl(var(--gradient-start))' }}>
        <TableHead style={{ background: 'hsl(var(--gradient-start))' }}>
          <span className="text-white font-bold text-center block">
            TEAM MEMBER
          </span>
        </TableHead>
        
        {projects.map((project) => (
          <TableHead key={project.id} style={{ background: 'hsl(var(--gradient-start))' }}>
            <div className="enhanced-project-code-header">
              <span className="text-white font-bold">
                {getDisplayText(project)}
              </span>
            </div>
          </TableHead>
        ))}
        
        <TableHead style={{ background: 'hsl(var(--gradient-start))' }}>
          <span className="text-white font-bold">TOTAL</span>
        </TableHead>
        <TableHead style={{ background: 'hsl(var(--gradient-start))' }}>
          <span className="text-white font-bold">CAPACITY</span>
        </TableHead>
        <TableHead style={{ background: 'hsl(var(--gradient-start))' }}>
          <span className="text-white font-bold">UTILIZATION</span>
        </TableHead>
        <TableHead style={{ background: 'hsl(var(--gradient-start))' }}>
          <span className="text-white font-bold">LEAVE</span>
        </TableHead>
        <TableHead style={{ background: 'hsl(var(--gradient-start))' }}>
          <span className="text-white font-bold">REMARKS</span>
        </TableHead>
      </TableRow>
    </TableHeader>
  );
};
