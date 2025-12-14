
import React from 'react';
import { TableCell } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { MemberVacationPopover } from '@/components/weekly-rundown/MemberVacationPopover';
import { format, startOfWeek } from 'date-fns';

interface NameCellProps {
  member: any;
  compact?: boolean;
  weekStartDate?: string;
}

export const NameCell: React.FC<NameCellProps> = ({ member, compact = false, weekStartDate }) => {
  // Calculate week start date if not provided
  const effectiveWeekStartDate = weekStartDate || format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd');
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
    
    // Debug logging to check the member object and avatar_url
    console.log('NameCell - Member object:', member);
    console.log('NameCell - Avatar URL:', member.avatar_url);
    console.log('NameCell - Member has avatar_url property:', 'avatar_url' in member);
    
    return 'avatar_url' in member ? member.avatar_url || undefined : undefined;
  };

  // Helper to get member display name
  const getMemberDisplayName = (): string => {
    if (!member) return 'Unknown';
    return `${member.first_name || ''} ${member.last_name || ''}`.trim() || 'Unnamed';
  };

  const memberTooltip = (
    <div className="space-y-1 text-xs">
      <p className="font-semibold">{getMemberDisplayName()}</p>
      {member.role && <p>Role: {member.role}</p>}
      {member.department && <p>Department: {member.department}</p>}
      {member.location && <p>Location: {member.location}</p>}
      {member.weekly_capacity && <p>Weekly Capacity: {member.weekly_capacity}h</p>}
      {member.email && <p>Email: {member.email}</p>}
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
    <TableCell className="font-medium border-r bg-white sticky left-0 z-10 min-w-[120px] max-w-[150px]">
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
