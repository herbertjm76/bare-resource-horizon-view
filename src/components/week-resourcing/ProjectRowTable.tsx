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

  // Header styles matching Team Leave benchmark
  const headerStyle = {
    backgroundColor: 'hsl(var(--theme-primary))',
    color: 'white'
  };

  const stickyHeaderStyle = {
    ...headerStyle,
    backgroundColor: 'hsl(var(--theme-primary))',
  };

  return (
    <div className="w-full overflow-x-auto" style={{ border: '1px solid hsl(var(--border))', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
      <Table className="weekly-table" style={{ width: 'auto', minWidth: '100%' }}>
        <TableHeader>
          <TableRow style={{ backgroundColor: 'hsl(var(--theme-primary))' }} className="border-b border-border">
            {/* Project Column */}
            <TableHead className="text-left font-semibold sticky left-0 z-30 border-r text-sm px-3" style={{ width: 220, minWidth: 220, ...stickyHeaderStyle, borderRightWidth: '2px', borderRightColor: 'rgba(255,255,255,0.2)' }}>
              Project
            </TableHead>
            
            {/* FTE Column */}
            <TableHead className="text-center font-semibold border-r text-xs px-0" style={{ width: 80, minWidth: 80, ...headerStyle, borderRightColor: 'rgba(255,255,255,0.2)' }}>
              FTE
            </TableHead>
            
            {/* Member Columns */}
            {members.map(member => {
              const memberAllocations = getMemberProjectAllocations(member.id);
              const memberTotal = getMemberTotal(member.id);
              const fullName = [member.first_name, member.last_name].filter(Boolean).join(' ') || 'Unknown';
              
              return (
                <TableHead key={member.id} className="text-center font-semibold border-r text-xs px-0 align-bottom" style={{ width: 40, minWidth: 40, ...headerStyle, borderRightColor: 'rgba(255,255,255,0.2)', verticalAlign: 'bottom' }}>
                  <MemberVacationPopover
                    memberId={member.id}
                    memberName={fullName}
                    weekStartDate={weekStartDate}
                  >
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
                                textOverflow: 'ellipsis'
                              }}
                            >
                              {getFirstName(member)}
                            </div>
                            <Avatar className="h-7 w-7 border border-white/30 hover:ring-2 hover:ring-white/50 transition-all">
                              <AvatarImage src={getAvatarUrl(member)} alt={getFirstName(member)} />
                              <AvatarFallback style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }} className="text-[10px]">
                                {getUserInitials(member.first_name, member.last_name)}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent 
                          side="bottom" 
                          className="bg-popover border border-border shadow-lg p-3 max-w-xs z-[100]"
                        >
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
                              <div className="text-xs text-muted-foreground">
                                No projects assigned this week
                              </div>
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
            <TableHead className="text-center font-semibold border-l-2 text-xs px-0" style={{ width: 60, minWidth: 60, ...stickyHeaderStyle, borderLeftColor: 'rgba(255,255,255,0.2)' }}>
              Total
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project, index) => {
            // Theme-based alternating row colors (matching Capacity Heatmap/Team Leave)
            const rowBgColor = index % 2 === 0 
              ? 'hsl(var(--background))' 
              : 'hsl(var(--theme-primary) / 0.02)';
            
            return (
              <TableRow 
                key={project.id} 
                className="transition-all duration-150"
                style={{ 
                  height: 33, 
                  minHeight: 33,
                  backgroundColor: rowBgColor
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(var(--theme-primary) / 0.08)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = rowBgColor}
              >
                <TableCell 
                  className="sticky left-0 z-20 px-3 py-1"
                  style={{ 
                    backgroundColor: 'hsl(var(--theme-primary) / 0.05)',
                    borderRight: '2px solid hsl(var(--theme-primary) / 0.15)',
                    borderBottom: '1px solid hsl(var(--border) / 0.3)'
                  }}
                >
                  <span className="text-sm font-semibold" style={{ color: 'hsl(var(--foreground))' }}>
                    {getProjectDisplayName(project, projectDisplayPreference)}
                  </span>
                </TableCell>
                <TableCell 
                  className="text-center p-0 align-middle" 
                  style={{ 
                    height: 33,
                    borderRight: '1px solid hsl(var(--border) / 0.5)',
                    borderBottom: '1px solid hsl(var(--border) / 0.3)'
                  }}
                >
                  <div className="flex items-center justify-center h-full">
                    {getProjectTotal(project.id) > 0 ? (
                      <div 
                        className="inline-flex items-center justify-center font-bold rounded px-2.5 py-1 text-sm min-w-[36px]"
                        style={{ backgroundColor: 'hsl(var(--theme-primary))', color: 'white' }}
                      >
                        {(getProjectTotal(project.id) / workWeekHours).toFixed(1)}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </div>
                </TableCell>
                {members.map((member, memberIndex) => {
                  const key = `${member.id}:${project.id}`;
                  const hours = allocationMap.get(key) || 0;
                  // Alternating column backgrounds
                  const columnBgColor = memberIndex % 2 === 0 
                    ? 'transparent' 
                    : 'hsl(var(--theme-primary) / 0.02)';
                  
                  return (
                    <TableCell
                      key={member.id}
                      className="text-center p-0"
                      style={{ 
                        width: 40, 
                        minWidth: 40,
                        backgroundColor: columnBgColor,
                        borderRight: '1px solid hsl(var(--border) / 0.5)',
                        borderBottom: '1px solid hsl(var(--border) / 0.3)'
                      }}
                    >
                      {hours > 0 && (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-sm font-semibold text-xs text-white" style={{ backgroundColor: '#22c55e' }}>
                          {formatAllocationValue(hours, getMemberCapacity(member), displayPreference)}
                        </span>
                      )}
                    </TableCell>
                  );
                })}
                <TableCell 
                  className="text-center p-0 align-middle" 
                  style={{ 
                    height: 33,
                    backgroundColor: 'hsl(var(--theme-primary) / 0.05)',
                    borderLeft: '2px solid hsl(var(--theme-primary) / 0.15)',
                    borderBottom: '1px solid hsl(var(--border) / 0.3)'
                  }}
                >
                  <div className="flex items-center justify-center h-full">
                    {getProjectTotal(project.id) > 0 ? (
                      <div 
                        className="inline-flex items-center justify-center font-bold rounded px-2.5 py-1 text-sm min-w-[36px]"
                        style={{ backgroundColor: 'hsl(var(--theme-primary))', color: 'white' }}
                      >
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
          <TableRow 
            style={{ 
              background: 'hsl(var(--theme-primary))', 
              height: 33 
            }} 
            className="border-t-2"
          >
            <TableCell 
              className="sticky left-0 z-30 text-left font-semibold text-white px-3"
              style={{ 
                background: 'hsl(var(--theme-primary))', 
                height: 33,
                borderRight: '2px solid hsl(var(--background) / 0.2)'
              }}
            >
              Weekly Total
            </TableCell>
            <TableCell 
              className="text-center p-0 align-middle" 
              style={{ 
                background: 'hsl(var(--theme-primary))', 
                height: 33,
                borderRight: '1px solid hsl(var(--background) / 0.2)'
              }}
            >
              <div className="flex items-center justify-center h-full">
                <div className="inline-flex items-center justify-center bg-white/20 text-white font-bold rounded px-2.5 py-1 text-sm min-w-[36px]">
                  {(members.reduce((sum, member) => sum + getMemberTotal(member.id), 0) / workWeekHours).toFixed(1)}
                </div>
              </div>
            </TableCell>
            {members.map(member => (
              <TableCell 
                key={member.id} 
                className="text-center p-0 align-middle" 
                style={{ 
                  background: 'hsl(var(--theme-primary))', 
                  height: 33,
                  borderRight: '1px solid hsl(var(--background) / 0.2)'
                }}
              >
                <div className="flex items-center justify-center h-full">
                  {getMemberTotal(member.id) > 0 ? (
                    <div className="inline-flex items-center justify-center bg-white/20 text-white font-bold rounded px-2.5 py-1 text-sm min-w-[36px]">
                      {formatAllocationValue(getMemberTotal(member.id), getMemberCapacity(member), displayPreference)}
                    </div>
                  ) : (
                    <span className="text-white/50">—</span>
                  )}
                </div>
              </TableCell>
            ))}
            <TableCell 
              className="text-center p-0 align-middle" 
              style={{ 
                background: 'hsl(var(--theme-primary))', 
                height: 33,
                borderLeft: '2px solid hsl(var(--background) / 0.2)'
              }}
            >
              <div className="flex items-center justify-center h-full">
                <div className="inline-flex items-center justify-center bg-white/20 text-white font-bold rounded px-2.5 py-1 text-sm min-w-[36px]">
                  {formatAllocationValue(members.reduce((sum, member) => sum + getMemberTotal(member.id), 0), defaultWeeklyCapacity * members.length, displayPreference)}
                </div>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};
