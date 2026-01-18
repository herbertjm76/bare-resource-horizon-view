
import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { useAppSettings } from '@/hooks/useAppSettings';
import { formatAllocationValue } from '@/utils/allocationDisplay';

interface NewResourceSummaryRowProps {
  projects: any[];
  allocationMap: Map<string, number>;
  members: any[];
}

export const NewResourceSummaryRow: React.FC<NewResourceSummaryRowProps> = ({
  projects,
  allocationMap,
  members
}) => {
  const { displayPreference, workWeekHours } = useAppSettings();
  // Calculate total hours across all projects
  let totalHours = 0;
  allocationMap.forEach((hours) => {
    totalHours += hours;
  });

  // Calculate project totals
  const projectTotals = projects.map(project => {
    let projectTotal = 0;
    
    members.forEach(member => {
      const key = `${member.id}:${project.id}`;
      const hours = allocationMap.get(key) || 0;
      projectTotal += hours;
    });
    
    return {
      projectId: project.id,
      totalHours: projectTotal
    };
  });

  return (
    <TableRow 
      className="font-medium border-t-2"
      style={{ 
        backgroundColor: 'hsl(var(--theme-primary))',
        height: 33
      }}
    >
      {/* Team Member Column */}
      <TableCell 
        className="sticky left-0 z-20 text-sm font-semibold text-white px-3"
        style={{ 
          backgroundColor: 'hsl(var(--theme-primary))',
          borderRight: '2px solid hsl(var(--background) / 0.2)'
        }}
      >
        Weekly Total
      </TableCell>
      
      {/* Utilization Column */}
      <TableCell 
        className="text-center text-sm font-semibold"
        style={{ 
          borderRight: '1px solid hsl(var(--background) / 0.2)'
        }}
      >
        <span className="text-white/50">—</span>
      </TableCell>
      
      {/* Project Count Column */}
      <TableCell 
        className="text-center text-sm font-semibold"
        style={{ 
          borderRight: '1px solid hsl(var(--background) / 0.2)'
        }}
      >
        <span className="inline-flex items-center justify-center bg-white/20 text-white font-bold rounded px-2 py-0.5 text-xs min-w-[28px]">
          {formatAllocationValue(totalHours, workWeekHours, displayPreference)}
        </span>
      </TableCell>
      
      {/* Project Columns */}
      {projects.map((project) => {
        const projectData = projectTotals.find(pt => pt.projectId === project.id);
        const hours = projectData?.totalHours || 0;
        
        return (
          <TableCell 
            key={project.id} 
            className="text-center text-sm font-semibold"
            style={{ 
              borderRight: '1px solid hsl(var(--background) / 0.2)'
            }}
          >
            {hours > 0 ? (
              <span className="inline-flex items-center justify-center bg-white/20 text-white font-bold rounded px-2 py-0.5 text-xs min-w-[28px]">
                {formatAllocationValue(hours, workWeekHours, displayPreference)}
              </span>
            ) : (
              <span className="text-white/50">—</span>
            )}
          </TableCell>
        );
      })}
    </TableRow>
  );
};
