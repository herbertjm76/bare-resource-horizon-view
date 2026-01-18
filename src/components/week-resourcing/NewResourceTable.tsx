
import React from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { NewResourceTableRow } from './NewResourceTableRow';
import { NewResourceSummaryRow } from './NewResourceSummaryRow';
import { useAppSettings } from '@/hooks/useAppSettings';
import { getProjectDisplayName, getProjectSecondaryText } from '@/utils/projectDisplay';

interface NewResourceTableProps {
  members: any[];
  projects: any[];
  allocationMap: Map<string, number>;
  annualLeaveData: Record<string, number>;
  holidaysData: Record<string, number>;
  otherLeaveData?: Record<string, number>;
  getMemberTotal: (memberId: string) => number;
  getProjectCount: (memberId: string) => number;
  getWeeklyLeave: (memberId: string) => Array<{ date: string; hours: number }>;
  updateOtherLeave?: (memberId: string, hours: number, notes?: string) => Promise<boolean>;
  viewMode: 'compact' | 'expanded';
  selectedWeek?: Date;
}

export const NewResourceTable: React.FC<NewResourceTableProps> = ({
  members,
  projects,
  allocationMap,
  annualLeaveData,
  holidaysData,
  otherLeaveData = {},
  getMemberTotal,
  getProjectCount,
  getWeeklyLeave,
  updateOtherLeave,
  viewMode,
  selectedWeek = new Date()
}) => {
  const { projectDisplayPreference } = useAppSettings();
  // Filter projects to only show those with allocated hours
  const projectsWithHours = React.useMemo(() => {
    return projects.filter(project => {
      let projectTotal = 0;
      
      // Calculate total hours for this project across all members
      members.forEach(member => {
        const key = `${member.id}:${project.id}`;
        const hours = allocationMap.get(key) || 0;
        projectTotal += hours;
      });
      
      return projectTotal > 0;
    });
  }, [projects, members, allocationMap]);
  
  const tableClassName = viewMode === 'compact' 
    ? 'resource-table-compact weekly-table enhanced-table' 
    : 'resource-table-expanded weekly-table enhanced-table';

  // Match Team Leave container styling exactly - clean white card with subtle themed headers
  return (
    <div className="w-full p-3">
      <div className="overflow-x-auto scrollbar-grey">
        <Table className="weekly-table w-full border-collapse" style={{ minWidth: 1200 }}>
          <TableHeader>
            <TableRow className="border-b border-border" style={{ backgroundColor: 'hsl(var(--theme-primary) / 0.05)' }}>
              {/* Team Member Column */}
              <TableHead
                className="sticky left-0 z-20 w-44 min-w-44 text-left px-3 py-3 font-semibold text-sm text-foreground"
                style={{ backgroundColor: 'hsl(var(--theme-primary) / 0.1)' }}
              >
                Team Member
              </TableHead>

              {/* Utilization Column */}
              <TableHead
                className="w-52 min-w-52 text-center font-semibold text-sm px-2 py-3 text-foreground"
                style={{ backgroundColor: 'hsl(var(--theme-primary) / 0.05)' }}
              >
                Total Utilization (1 week)
              </TableHead>

              {/* Project Count Column */}
              <TableHead
                className="w-16 min-w-16 text-center font-semibold text-sm px-1 py-3 text-foreground"
                style={{ backgroundColor: 'hsl(var(--theme-primary) / 0.05)' }}
              >
                Projects
              </TableHead>

              {/* Project Columns with Rotated Text - Only show projects with hours */}
              {projectsWithHours.map((project, idx) => (
                <TableHead
                  key={project.id}
                  className="w-10 min-w-10 text-center font-medium px-0.5 py-1.5 text-foreground"
                  style={{ 
                    backgroundColor: 'hsl(var(--theme-primary) / 0.05)',
                    height: 120 
                  }}
                >
                  <div className="flex items-center justify-center h-full">
                    <div
                      className="transform -rotate-90 whitespace-nowrap text-xs font-medium"
                      style={{
                        transformOrigin: 'center',
                        maxWidth: '100px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                      title={`${getProjectDisplayName(project, projectDisplayPreference)} - ${getProjectSecondaryText(project, projectDisplayPreference)}`}
                    >
                      {getProjectDisplayName(project, projectDisplayPreference)}
                    </div>
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member, index) => (
              <NewResourceTableRow
                key={member.id}
                member={member}
                memberIndex={index}
                projects={projectsWithHours}
                allocationMap={allocationMap}
                annualLeaveData={annualLeaveData}
                holidaysData={holidaysData}
                otherLeaveData={otherLeaveData}
                getMemberTotal={getMemberTotal}
                getProjectCount={getProjectCount}
                getWeeklyLeave={getWeeklyLeave}
                updateOtherLeave={updateOtherLeave}
                viewMode={viewMode}
                selectedWeek={selectedWeek}
              />
            ))}
            <NewResourceSummaryRow
              projects={projectsWithHours}
              allocationMap={allocationMap}
              members={members}
            />
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
