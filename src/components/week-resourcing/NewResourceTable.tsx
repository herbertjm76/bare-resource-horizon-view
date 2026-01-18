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
  getWeeklyLeave: (memberId: string) => Array<{
    date: string;
    hours: number;
  }>;
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
  const {
    projectDisplayPreference
  } = useAppSettings();
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

  // NOTE: We intentionally do NOT apply the `weekly-table` class here.
  // That class is styled via aggressive CSS overrides and was causing the purple tint.
  return <Table className="w-full border-collapse" style={{
    minWidth: 1200
  }}>
      <TableHeader>
        <TableRow className="border-b border-border bg-muted">
          {/* Team Member Column */}
          <TableHead className="sticky left-0 z-20 text-left px-2 py-3 font-semibold text-sm text-foreground bg-muted" style={{ width: 66, minWidth: 66 }}>
            Team Member
          </TableHead>

          {/* Utilization Column */}
          <TableHead className="w-52 min-w-52 text-center font-semibold text-sm px-2 py-3 text-foreground bg-muted">
            Total Utilization (1 week)
          </TableHead>

          {/* Project Count Column */}
          <TableHead className="w-16 min-w-16 text-center font-semibold text-sm px-1 py-3 text-foreground bg-muted">
            Projects
          </TableHead>

          {/* Project Columns with Rotated Text - Only show projects with hours */}
          {projectsWithHours.map(project => <TableHead key={project.id} className="text-center font-medium px-0 py-1.5 text-foreground bg-muted align-bottom overflow-hidden" style={{
          width: 28,
          minWidth: 28,
          maxWidth: 28
        }}>
              <div className="flex items-end justify-center h-[120px] w-full overflow-hidden">
                <div className="-rotate-90 whitespace-nowrap text-xs font-medium max-w-[100px] overflow-hidden text-ellipsis" style={{
              transformOrigin: 'center'
            }} title={`${getProjectDisplayName(project, projectDisplayPreference)} - ${getProjectSecondaryText(project, projectDisplayPreference)}`}>
                  {getProjectDisplayName(project, projectDisplayPreference)}
                </div>
              </div>
            </TableHead>)}
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((member, index) => <NewResourceTableRow key={member.id} member={member} memberIndex={index} projects={projectsWithHours} allocationMap={allocationMap} annualLeaveData={annualLeaveData} holidaysData={holidaysData} otherLeaveData={otherLeaveData} getMemberTotal={getMemberTotal} getProjectCount={getProjectCount} getWeeklyLeave={getWeeklyLeave} updateOtherLeave={updateOtherLeave} viewMode={viewMode} selectedWeek={selectedWeek} />)}
        <NewResourceSummaryRow projects={projectsWithHours} allocationMap={allocationMap} members={members} />
      </TableBody>
    </Table>;
};