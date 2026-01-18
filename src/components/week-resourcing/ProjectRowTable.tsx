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

  const getDisplayName = (member: any): string => {
    if (!member) return 'Unknown';
    if (member.first_name) {
      const lastInitial = member.last_name?.charAt(0) || '';
      return `${member.first_name} ${lastInitial}.`;
    }
    if (member.isPending || member.isDeleted) return member.name || 'Pending';
    return member.name || 'Unknown';
  };

  // NOTE: We intentionally do NOT apply the `weekly-table` class here.
  // That class is styled via aggressive CSS overrides and was causing the purple tint.
  return (
    <Table className="w-full border-collapse" style={{ minWidth: 1200 }}>
      <TableHeader>
        <TableRow className="border-b border-border bg-muted">
          {/* Project Column */}
          <TableHead className="sticky left-0 z-30 w-56 min-w-56 text-left px-3 py-3 font-semibold text-sm text-foreground bg-muted">
            Project
          </TableHead>

          {/* FTE Column */}
          <TableHead className="w-20 min-w-20 text-center font-semibold text-xs px-0 py-3 text-foreground bg-muted">
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
                className="w-10 min-w-10 text-center font-medium px-0.5 py-1.5 text-foreground bg-muted align-bottom"
              >
                <MemberVacationPopover memberId={member.id} memberName={fullName} weekStartDate={weekStartDate}>
                  <div className="cursor-pointer">
                    <Tooltip delayDuration={200}>
                      <TooltipTrigger asChild>
                        <div className="flex flex-col items-center gap-1 pb-1">
                          <div
                            className="text-xs font-medium text-foreground"
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
                            {getDisplayName(member)}
                          </div>
                          <Avatar className="h-7 w-7 border border-border hover:ring-2 hover:ring-ring/30 transition-all">
                            <AvatarImage src={getAvatarUrl(member)} alt={getDisplayName(member)} />
                            <AvatarFallback className="text-[10px] font-medium bg-muted text-foreground">
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
          <TableHead className="w-14 min-w-14 text-center font-semibold text-xs px-2 py-3 text-foreground border-l border-border bg-muted">
            Total
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {projects.map((project, index) => {
          const rowBg = index % 2 === 0 ? 'hsl(var(--background))' : 'hsl(var(--muted) / 0.35)';

          return (
            <TableRow
              key={project.id}
              className="group transition-colors hover:bg-muted/60"
              style={{ backgroundColor: rowBg, height: 33 }}
            >
              <TableCell
                className="sticky left-0 z-20 px-3 py-1.5 border-r border-border overflow-hidden"
                style={{ backgroundColor: rowBg, maxWidth: 224 }}
              >
                <span className="block text-sm font-semibold text-foreground truncate whitespace-nowrap">
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
                        className="inline-flex items-center justify-center w-7 h-6 rounded font-semibold text-xs"
                        style={{ backgroundColor: 'hsl(var(--success))', color: 'hsl(var(--success-foreground))' }}
                      >
                        {formatAllocationValue(hours, getMemberCapacity(member), displayPreference)}
                      </span>
                    )}
                  </TableCell>
                );
              })}

              <TableCell className="text-center p-0 align-middle border-l border-border" style={{ height: 33 }}>
                <div className="flex items-center justify-center h-full">
                  {getProjectTotal(project.id) > 0 ? (
                    <div className="inline-flex items-center justify-center font-bold rounded px-1.5 py-0.5 text-xs min-w-[36px] bg-muted text-foreground">
                      {formatAllocationValue(getProjectTotal(project.id), defaultWeeklyCapacity, displayPreference)}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </div>
              </TableCell>
            </TableRow>
          );
        })}

        {/* Totals Row */}
        <TableRow className="summary-row border-t border-border bg-muted" style={{ height: 40 }}>
          <TableCell className="sticky left-0 z-30 text-left px-3 py-2 font-semibold text-sm text-foreground bg-muted">
            Weekly Total
          </TableCell>
          <TableCell className="text-center p-0 align-middle" style={{ height: 40 }}>
            <div className="flex items-center justify-center h-full">
              <div className="inline-flex items-center justify-center font-bold rounded px-2 py-1 text-sm bg-foreground text-background">
                {(members.reduce((sum, member) => sum + getMemberTotal(member.id), 0) / workWeekHours).toFixed(1)}
              </div>
            </div>
          </TableCell>
          {members.map((member) => (
            <TableCell key={member.id} className="text-center p-0 align-middle" style={{ height: 40 }}>
              <div className="flex items-center justify-center h-full">
                {getMemberTotal(member.id) > 0 ? (
                  <div className="inline-flex items-center justify-center font-bold rounded px-1.5 py-0.5 text-xs bg-foreground text-background">
                    {formatAllocationValue(getMemberTotal(member.id), getMemberCapacity(member), displayPreference)}
                  </div>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </div>
            </TableCell>
          ))}
          <TableCell className="text-center p-0 align-middle border-l border-border" style={{ height: 40 }}>
            <div className="flex items-center justify-center h-full">
              <div className="inline-flex items-center justify-center font-bold rounded px-2 py-1 text-sm bg-foreground text-background">
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
  );
};
