
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
      className="summary-row border-t border-border"
      style={{ backgroundColor: 'hsl(var(--theme-primary) / 0.1)', height: 40 }}
    >
      {/* Team Member Column */}
      <TableCell 
        className="sticky left-0 z-20 text-left px-3 py-2 font-semibold text-sm text-foreground"
        style={{ backgroundColor: 'hsl(var(--theme-primary) / 0.1)' }}
      >
        Weekly Total
      </TableCell>

      {/* Utilization Column */}
      <TableCell className="text-center text-sm font-semibold">
        <span className="text-muted-foreground">—</span>
      </TableCell>

      {/* Project Count Column */}
      <TableCell className="text-center text-sm font-semibold">
        <span 
          className="inline-flex items-center justify-center font-bold rounded px-2 py-1 text-sm"
          style={{ backgroundColor: 'hsl(var(--theme-primary))', color: 'white' }}
        >
          {formatAllocationValue(totalHours, workWeekHours, displayPreference)}
        </span>
      </TableCell>

      {/* Project Columns */}
      {projects.map((project) => {
        const projectData = projectTotals.find((pt) => pt.projectId === project.id);
        const hours = projectData?.totalHours || 0;

        return (
          <TableCell 
            key={project.id} 
            className="text-center text-[10px] font-semibold px-0"
            style={{ width: 28, minWidth: 28, maxWidth: 28 }}
          >
            {hours > 0 ? (
              <span 
                className="inline-flex items-center justify-center font-bold rounded text-[10px]"
                style={{ backgroundColor: 'hsl(var(--theme-primary))', color: 'white' }}
              >
                {formatAllocationValue(hours, workWeekHours, displayPreference)}
              </span>
            ) : (
              <span className="text-muted-foreground text-[10px]">—</span>
            )}
          </TableCell>
        );
      })}
    </TableRow>
  );
};
