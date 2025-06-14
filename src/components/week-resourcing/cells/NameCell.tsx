
import React from 'react';
import { TableCell } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';

interface NameCellProps {
  member: any;
  compact?: boolean;
}

export const NameCell: React.FC<NameCellProps> = ({ member, compact = false }) => {
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
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1 text-xs cursor-pointer" title={getMemberDisplayName()}>
              <Avatar className="h-5 w-5">
                <AvatarImage 
                  src={avatarUrl} 
                  alt={getMemberDisplayName()}
                  onError={() => {
                    console.log('NameCell - Avatar image failed to load:', avatarUrl);
                  }}
                  onLoad={() => {
                    console.log('NameCell - Avatar image loaded successfully:', avatarUrl);
                  }}
                />
                <AvatarFallback className="bg-[#6465F0] text-white text-[10px]">
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
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <TableCell className="font-medium border-r bg-white sticky left-0 z-10 min-w-[120px] max-w-[150px]">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2 px-2 text-sm cursor-pointer" title={getMemberDisplayName()}>
              <Avatar className="h-6 w-6">
                <AvatarImage 
                  src={avatarUrl} 
                  alt={getMemberDisplayName()}
                  onError={() => {
                    console.log('NameCell - Avatar image failed to load:', avatarUrl);
                  }}
                  onLoad={() => {
                    console.log('NameCell - Avatar image loaded successfully:', avatarUrl);
                  }}
                />
                <AvatarFallback className="bg-[#6465F0] text-white text-xs">
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
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </TableCell>
  );
};
