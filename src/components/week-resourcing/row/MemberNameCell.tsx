
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
    return member.first_name || 'Unnamed';
  };

  // Helper to get member display name for tooltip
  const getMemberName = (): string => {
    if (!member) return 'Unknown';
    return `${member.first_name || ''} ${member.last_name || ''}`.trim() || 'Unnamed';
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
        <Avatar className="h-8 w-8">
          <AvatarImage src={getAvatarUrl()} alt={getMemberName()} />
          <AvatarFallback className="bg-brand-violet text-white text-xs">
            {getUserInitials()}
          </AvatarFallback>
        </Avatar>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="truncate">{getFirstName()}</span>
          </TooltipTrigger>
          <TooltipContent>
            <p>{getMemberName()}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TableCell>
  );
};
