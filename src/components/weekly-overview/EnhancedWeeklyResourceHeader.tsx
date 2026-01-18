
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
  
  const headerStyle = {
    backgroundColor: 'hsl(var(--theme-primary) / 0.1)',
    color: 'hsl(var(--foreground))',
    borderBottom: '1px solid hsl(var(--border))'
  };

  const stickyHeaderStyle = {
    ...headerStyle,
    backgroundColor: 'hsl(var(--theme-primary) / 0.15)',
  };
  
  return (
    <TableHeader>
      <TableRow style={{ backgroundColor: 'hsl(var(--theme-primary) / 0.05)' }}>
        <TableHead style={stickyHeaderStyle}>
          <span className="font-bold text-center block">
            TEAM MEMBER
          </span>
        </TableHead>
        
        {projects.map((project) => (
          <TableHead key={project.id} style={headerStyle}>
            <div className="enhanced-project-code-header">
              <span className="font-bold" style={{ color: 'hsl(var(--foreground))' }}>
                {getDisplayText(project)}
              </span>
            </div>
          </TableHead>
        ))}
        
        <TableHead style={stickyHeaderStyle}>
          <span className="font-bold">TOTAL</span>
        </TableHead>
        <TableHead style={headerStyle}>
          <span className="font-bold">CAPACITY</span>
        </TableHead>
        <TableHead style={headerStyle}>
          <span className="font-bold">UTILIZATION</span>
        </TableHead>
        <TableHead style={headerStyle}>
          <span className="font-bold">LEAVE</span>
        </TableHead>
        <TableHead style={headerStyle}>
          <span className="font-bold">REMARKS</span>
        </TableHead>
      </TableRow>
    </TableHeader>
  );
};
