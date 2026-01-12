
import React from 'react';
import { TableCell } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface MemberNameCellProps {
  member: any;
}

export const MemberNameCell: React.FC<MemberNameCellProps> = ({ member }) => {
  // Helper to get just the first name
  const getFirstName = (): string => {
    if (!member) return 'Unknown';
    if (member.first_name) return member.first_name;
    // Fallback to name property for pre-registered/deleted resources
    if (member.isPending || member.isDeleted) return member.name || 'Pending';
    return member.name || 'Unknown';
  };

  // Helper to get member display name for tooltip
  const getMemberName = (): string => {
    if (!member) return 'Unknown';
    const fullName = `${member.first_name || ''} ${member.last_name || ''}`.trim();
    if (fullName) return fullName;
    // Fallback to name property for pre-registered/deleted resources
    if (member.isPending) return member.name || 'Pending invite';
    if (member.isDeleted) return member.name || 'Deleted Resource';
    return member.name || 'Unknown';
  };

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

  return (
    <TableCell className="sticky-column sticky-left-0 border-r font-medium py-1 text-center w-[150px]">
      <div className="flex items-center gap-2 justify-center">
        <Avatar className="h-[45px] w-[45px]">
          <AvatarImage src={getAvatarUrl()} alt={getMemberName()} />
          <AvatarFallback className="bg-gradient-modern text-white text-sm">
            {getUserInitials()}
          </AvatarFallback>
        </Avatar>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="truncate cursor-pointer">{getFirstName()}</span>
          </TooltipTrigger>
          <TooltipContent>
            <p>{getMemberName()}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TableCell>
  );
};
