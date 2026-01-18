
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
    <TableRow className="enhanced-totals-row" style={{ height: 33 }}>
      {/* Team Member Column */}
      <TableCell className="sticky left-0 z-20 text-sm font-semibold px-3 name-column">
        Weekly Total
      </TableCell>

      {/* Utilization Column */}
      <TableCell className="text-center text-sm font-semibold">
        <span className="text-white/50">—</span>
      </TableCell>

      {/* Project Count Column */}
      <TableCell className="text-center text-sm font-semibold">
        <span className="enhanced-pill">
          {formatAllocationValue(totalHours, workWeekHours, displayPreference)}
        </span>
      </TableCell>

      {/* Project Columns */}
      {projects.map((project) => {
        const projectData = projectTotals.find((pt) => pt.projectId === project.id);
        const hours = projectData?.totalHours || 0;

        return (
          <TableCell key={project.id} className="text-center text-sm font-semibold">
            {hours > 0 ? (
              <span className="enhanced-pill">
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
