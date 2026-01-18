
import React from 'react';
import { TableCell } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface MemberNameCellProps {
  member: any;
}

export const MemberNameCell: React.FC<MemberNameCellProps> = ({ member }) => {
  // Helper to get display name (First Name + Last Initial)
  const getDisplayName = (): string => {
    if (!member) return 'Unknown';
    if (member.first_name) {
      const lastInitial = member.last_name?.charAt(0) || '';
      return `${member.first_name} ${lastInitial}.`;
    }
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
    <TableCell 
      className="sticky-column sticky-left-0 border-r font-medium py-1 text-center"
      style={{ width: 150, minWidth: 150, maxWidth: 150 }}
    >
      <div className="flex items-center justify-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <Avatar className="h-8 w-8 cursor-pointer">
              <AvatarImage src={getAvatarUrl()} alt={getMemberName()} />
              <AvatarFallback className="bg-gradient-modern text-white text-xs">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
          </TooltipTrigger>
          <TooltipContent>
            <p>{getMemberName()}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TableCell>
  );
};
