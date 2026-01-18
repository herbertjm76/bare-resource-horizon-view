
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

  // Use Team Leave benchmark container framing
  return (
    <div className="enhanced-table-scroll">
      <div className="enhanced-table-container">
        <Table className={`${tableClassName} min-w-full`} style={{ minWidth: 1200 }}>
          <TableHeader>
            <TableRow>
              {/* Team Member Column */}
              <TableHead
                className="text-center font-semibold sticky left-0 z-20 border-r text-sm name-column"
                style={{ width: 180, minWidth: 180 }}
              >
                Team Member
              </TableHead>

              {/* Utilization Column */}
              <TableHead
                className="text-center font-semibold border-r text-sm"
                style={{ width: 200, minWidth: 200 }}
              >
                Total Utilization (1 week)
              </TableHead>

              {/* Project Count Column */}
              <TableHead
                className="text-center font-semibold border-r text-sm"
                style={{ width: 35, minWidth: 35 }}
              >
                Projects
              </TableHead>

              {/* Project Columns with Rotated Text - Only show projects with hours */}
              {projectsWithHours.map((project) => (
                <TableHead
                  key={project.id}
                  className="text-center font-semibold border-r relative text-sm"
                  style={{ width: 35, minWidth: 35, height: 120 }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
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
