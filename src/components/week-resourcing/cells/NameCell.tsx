
import React from 'react';
import { TableCell } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { MemberVacationPopover } from '@/components/weekly-rundown/MemberVacationPopover';
import { format, startOfWeek } from 'date-fns';
import { useAppSettings } from '@/hooks/useAppSettings';
import { getProjectDisplayName } from '@/utils/projectDisplay';
import { formatAllocationValue } from '@/utils/allocationDisplay';

interface ProjectAllocation {
  projectId: string;
  projectName: string;
  projectCode: string;
  hours: number;
}

interface NameCellProps {
  member: any;
  compact?: boolean;
  weekStartDate?: string;
  projectAllocations?: ProjectAllocation[];
  utilizationPercentage?: number;
  totalAllocatedHours?: number;
}

export const NameCell: React.FC<NameCellProps> = ({ 
  member, 
  compact = false, 
  weekStartDate,
  projectAllocations = [],
  utilizationPercentage = 0,
  totalAllocatedHours = 0
}) => {
  const { projectDisplayPreference, displayPreference, workWeekHours } = useAppSettings();
  
  // Calculate week start date if not provided
  const effectiveWeekStartDate = weekStartDate || format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd');
  
  // Get member capacity
  const memberCapacity = member?.weekly_capacity || workWeekHours;
  
  // Helper to get user initials
  const getUserInitials = (): string => {
    if (!member) return '??';
    const firstName = member.first_name || '';
    const lastName = member.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Helper to get avatar URL safely
  const getAvatarUrl = (): string | undefined => {
    if (!member) return undefined;
    return 'avatar_url' in member ? member.avatar_url || undefined : undefined;
  };

  // Helper to get member display name
  const getMemberDisplayName = (): string => {
    if (!member) return 'Unknown';
    const fullName = `${member.first_name || ''} ${member.last_name || ''}`.trim();
    if (fullName) return fullName;
    // Fallback to name property for pre-registered/deleted resources
    if (member.isPending) return member.name || 'Pending invite';
    if (member.isDeleted) return member.name || 'Deleted Resource';
    return member.name || 'Unknown';
  };

  const memberTooltip = (
    <div className="space-y-2">
      <div className="font-semibold text-sm text-foreground">{getMemberDisplayName()}</div>
      <div className="text-xs text-muted-foreground">
        {Math.round(utilizationPercentage)}% utilized • {formatAllocationValue(totalAllocatedHours, memberCapacity, displayPreference)} allocated
      </div>
      
      {projectAllocations.length > 0 ? (
        <div className="space-y-1.5 pt-1 border-t border-border">
          <div className="text-xs font-medium text-muted-foreground">Working on:</div>
          {projectAllocations.map((project) => (
            <div key={project.projectId} className="flex justify-between items-center text-xs">
              <span className="text-foreground truncate max-w-[140px]">
                {getProjectDisplayName({ code: project.projectCode, name: project.projectName }, projectDisplayPreference)}
              </span>
              <span className="text-muted-foreground font-medium ml-2">{formatAllocationValue(project.hours, memberCapacity, displayPreference)}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-xs text-muted-foreground italic pt-1 border-t border-border">
          No projects assigned this week
        </div>
      )}
    </div>
  );

  const avatarUrl = getAvatarUrl();

  if (compact) {
    return (
      <MemberVacationPopover
        memberId={member.id}
        memberName={getMemberDisplayName()}
        weekStartDate={effectiveWeekStartDate}
      >
        <div className="cursor-pointer">
          <TooltipProvider>
            <Tooltip delayDuration={200}>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 text-xs" title={getMemberDisplayName()}>
                  <Avatar className="h-5 w-5 hover:ring-2 hover:ring-primary/50 transition-all">
                    <AvatarImage 
                      src={avatarUrl} 
                      alt={getMemberDisplayName()}
                    />
                    <AvatarFallback className="text-white text-[10px]" style={{ background: 'hsl(var(--gradient-start))' }}>
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="truncate flex-1 name-cell-label">
                    <span className="text-[11px]">{member.first_name?.substring(0, 1)}. {member.last_name}</span>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent 
                side="right" 
                align="start" 
                sideOffset={8}
                className="z-[200] max-w-xs"
                avoidCollisions={true}
              >
                {memberTooltip}
                <p className="text-xs text-muted-foreground/70 pt-1 border-t border-border/50 mt-2">Click to add hours or leave</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </MemberVacationPopover>
    );
  }

  return (
    <TableCell className="font-medium border-r border-border bg-background sticky left-0 z-10 min-w-[120px] max-w-[150px]">
      <MemberVacationPopover
        memberId={member.id}
        memberName={getMemberDisplayName()}
        weekStartDate={effectiveWeekStartDate}
      >
        <div className="cursor-pointer">
          <TooltipProvider>
            <Tooltip delayDuration={200}>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 px-2 text-sm" title={getMemberDisplayName()}>
                  <Avatar className="h-6 w-6 hover:ring-2 hover:ring-primary/50 transition-all">
                    <AvatarImage 
                      src={avatarUrl} 
                      alt={getMemberDisplayName()}
                    />
                    <AvatarFallback className="text-white text-xs" style={{ background: 'hsl(var(--gradient-start))' }}>
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="truncate flex-1">
                    <span className="hidden sm:inline">{getMemberDisplayName()}</span>
                    <span className="sm:hidden">{member.first_name?.substring(0, 1)}. {member.last_name}</span>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent 
                side="right" 
                align="start" 
                sideOffset={8}
                className="z-[200] max-w-xs"
                avoidCollisions={true}
              >
                {memberTooltip}
                <p className="text-xs text-muted-foreground/70 pt-1 border-t border-border/50 mt-2">Click to add hours or leave</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </MemberVacationPopover>
    </TableCell>
  );
};
