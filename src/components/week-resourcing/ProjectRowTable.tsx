import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useAppSettings } from '@/hooks/useAppSettings';
import { getProjectDisplayName } from '@/utils/projectDisplay';
import { MemberVacationPopover } from '@/components/weekly-rundown/MemberVacationPopover';
import { formatAllocationValue } from '@/utils/allocationDisplay';

interface ProjectRowTableProps {
  projects: any[];
  members: any[];
  allocationMap: Map<string, number>;
  weekStartDate: string;
}

export const ProjectRowTable: React.FC<ProjectRowTableProps> = ({
  projects,
  members,
  allocationMap,
  weekStartDate
}) => {
  const { projectDisplayPreference, workWeekHours, displayPreference } = useAppSettings();

  const defaultWeeklyCapacity = workWeekHours || 40;

  // Helper to get a member's weekly capacity (falls back to company workWeekHours)
  const getMemberCapacity = (member: any): number => {
    return member?.weekly_capacity || defaultWeeklyCapacity;
  };

  // Calculate member totals (in hours)
  const getMemberTotal = (memberId: string): number => {
    let total = 0;
    projects.forEach(project => {
      const key = `${memberId}:${project.id}`;
      total += allocationMap.get(key) || 0;
    });
    return total;
  };

  // Calculate project totals (in hours)
  const getProjectTotal = (projectId: string): number => {
    let total = 0;
    members.forEach(member => {
      const key = `${member.id}:${projectId}`;
      total += allocationMap.get(key) || 0;
    });
    return total;
  };

  // Get member's project allocations for tooltip
  const getMemberProjectAllocations = (memberId: string) => {
    const allocations: { project: any; hours: number }[] = [];
    projects.forEach(project => {
      const key = `${memberId}:${project.id}`;
      const hours = allocationMap.get(key) || 0;
      if (hours > 0) {
        allocations.push({ project, hours });
      }
    });
    return allocations;
  };

  const getUserInitials = (firstName?: string, lastName?: string) => {
    const first = (firstName || '').trim();
    const last = (lastName || '').trim();
    if (!first && !last) return '?';
    return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
  };

  const getAvatarUrl = (member: any): string | undefined => {
    return 'avatar_url' in member ? member.avatar_url || undefined : undefined;
  };

  const getFirstName = (member: any): string => {
    if (member.first_name) return member.first_name;
    if (member.isPending || member.isDeleted) return member.name || 'Pending';
    return member.name || 'Unknown';
  };

  // Use Team Leave benchmark container framing
  return (
    <div className="enhanced-table-scroll">
      <div className="enhanced-table-container">
        <Table className="weekly-table enhanced-table" style={{ width: 'auto', minWidth: 1200 }}>
          <TableHeader>
            <TableRow>
              {/* Project Column */}
              <TableHead
                className="text-left font-semibold sticky left-0 z-30 border-r text-sm px-3 name-column"
                style={{ width: 220, minWidth: 220 }}
              >
                Project
              </TableHead>

              {/* FTE Column */}
              <TableHead className="text-center font-semibold border-r text-xs px-0" style={{ width: 80, minWidth: 80 }}>
                FTE
              </TableHead>

              {/* Member Columns */}
              {members.map((member) => {
                const memberAllocations = getMemberProjectAllocations(member.id);
                const memberTotal = getMemberTotal(member.id);
                const fullName = [member.first_name, member.last_name].filter(Boolean).join(' ') || 'Unknown';

                return (
                  <TableHead
                    key={member.id}
                    className="text-center font-semibold border-r text-xs px-0 align-bottom"
                    style={{ width: 40, minWidth: 40, verticalAlign: 'bottom' }}
                  >
                    <MemberVacationPopover memberId={member.id} memberName={fullName} weekStartDate={weekStartDate}>
                      <div className="cursor-pointer">
                        <Tooltip delayDuration={200}>
                          <TooltipTrigger asChild>
                            <div className="flex flex-col items-center gap-1 pb-1">
                              <div
                                className="text-xs font-medium"
                                style={{
                                  writingMode: 'vertical-rl',
                                  textOrientation: 'mixed',
                                  transform: 'rotate(180deg)',
                                  whiteSpace: 'nowrap',
                                  maxHeight: '120px',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}
                              >
                                {getFirstName(member)}
                              </div>
                              <Avatar className="h-7 w-7 border border-border hover:ring-2 hover:ring-ring/30 transition-all">
                                <AvatarImage src={getAvatarUrl(member)} alt={getFirstName(member)} />
                                <AvatarFallback className="text-[10px] bg-muted text-foreground">
                                  {getUserInitials(member.first_name, member.last_name)}
                                </AvatarFallback>
                              </Avatar>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="bottom" className="bg-popover border border-border shadow-lg p-3 max-w-xs z-[100]">
                            <div className="space-y-2">
                              <div className="font-semibold text-sm text-foreground border-b border-border pb-2">
                                {fullName}
                              </div>

                              {memberAllocations.length > 0 ? (
                                <div className="space-y-1">
                                  <div className="text-xs font-medium text-muted-foreground mb-1">Projects:</div>
                                  {memberAllocations.map((alloc) => (
                                    <div key={alloc.project.id} className="flex justify-between items-center text-xs">
                                      <span className="text-foreground truncate max-w-[140px]">
                                        {getProjectDisplayName(alloc.project, projectDisplayPreference)}
                                      </span>
                                      <span className="text-muted-foreground font-medium ml-2">
                                        {formatAllocationValue(alloc.hours, getMemberCapacity(member), displayPreference)}
                                      </span>
                                    </div>
                                  ))}
                                  <div className="border-t border-border pt-1 mt-2 flex justify-between font-semibold text-sm text-foreground">
                                    <span>Total:</span>
                                    <span>{formatAllocationValue(memberTotal, getMemberCapacity(member), displayPreference)}</span>
                                  </div>
                                </div>
                              ) : (
                                <div className="text-xs text-muted-foreground">No projects assigned this week</div>
                              )}
                              <div className="text-xs text-muted-foreground/70 pt-1 border-t border-border/50 mt-2">
                                Click to add hours or leave
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </MemberVacationPopover>
                  </TableHead>
                );
              })}

              {/* Total Column */}
              <TableHead className="text-center font-semibold border-l-2 text-xs px-0" style={{ width: 60, minWidth: 60 }}>
                Total
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {projects.map((project, index) => (
              <TableRow
                key={project.id}
                className={`member-row ${index % 2 === 0 ? 'even-row' : 'odd-row'}`}
                style={{ height: 33, minHeight: 33 }}
              >
                <TableCell className="sticky left-0 z-20 px-3 py-1 name-column">
                  <span className="text-sm font-semibold">
                    {getProjectDisplayName(project, projectDisplayPreference)}
                  </span>
                </TableCell>

                <TableCell className="text-center p-0 align-middle" style={{ height: 33 }}>
                  <div className="flex items-center justify-center h-full">
                    {getProjectTotal(project.id) > 0 ? (
                      <div className="inline-flex items-center justify-center font-bold rounded px-2.5 py-1 text-sm min-w-[36px] bg-muted text-foreground">
                        {(getProjectTotal(project.id) / workWeekHours).toFixed(1)}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </div>
                </TableCell>

                {members.map((member) => {
                  const key = `${member.id}:${project.id}`;
                  const hours = allocationMap.get(key) || 0;

                  return (
                    <TableCell key={member.id} className="text-center p-0" style={{ width: 40, minWidth: 40 }}>
                      {hours > 0 && (
                        <span
                          className="inline-flex items-center justify-center w-7 h-7 rounded-sm font-semibold text-xs"
                          style={{ backgroundColor: 'hsl(var(--success))', color: 'hsl(var(--success-foreground))' }}
                        >
                          {formatAllocationValue(hours, getMemberCapacity(member), displayPreference)}
                        </span>
                      )}
                    </TableCell>
                  );
                })}

                <TableCell className="text-center p-0 align-middle" style={{ height: 33 }}>
                  <div className="flex items-center justify-center h-full">
                    {getProjectTotal(project.id) > 0 ? (
                      <div className="inline-flex items-center justify-center font-bold rounded px-2.5 py-1 text-sm min-w-[36px] bg-muted text-foreground">
                        {formatAllocationValue(getProjectTotal(project.id), defaultWeeklyCapacity, displayPreference)}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {/* Totals Row */}
            <TableRow className="enhanced-totals-row" style={{ height: 33 }}>
              <TableCell className="sticky left-0 z-30 text-left font-semibold px-3 name-column">
                Weekly Total
              </TableCell>
              <TableCell className="text-center p-0 align-middle" style={{ height: 33 }}>
                <div className="flex items-center justify-center h-full">
                  <div className="enhanced-pill">
                    {(members.reduce((sum, member) => sum + getMemberTotal(member.id), 0) / workWeekHours).toFixed(1)}
                  </div>
                </div>
              </TableCell>
              {members.map((member) => (
                <TableCell key={member.id} className="text-center p-0 align-middle" style={{ height: 33 }}>
                  <div className="flex items-center justify-center h-full">
                    {getMemberTotal(member.id) > 0 ? (
                      <div className="enhanced-pill">
                        {formatAllocationValue(getMemberTotal(member.id), getMemberCapacity(member), displayPreference)}
                      </div>
                    ) : (
                      <span className="text-white/50">—</span>
                    )}
                  </div>
                </TableCell>
              ))}
              <TableCell className="text-center p-0 align-middle" style={{ height: 33 }}>
                <div className="flex items-center justify-center h-full">
                  <div className="enhanced-pill">
                    {formatAllocationValue(
                      members.reduce((sum, member) => sum + getMemberTotal(member.id), 0),
                      defaultWeeklyCapacity * members.length,
                      displayPreference
                    )}
                  </div>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
