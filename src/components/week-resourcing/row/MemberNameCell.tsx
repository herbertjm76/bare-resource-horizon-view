
import React from 'react';
import { TableCell } from '@/components/ui/table';
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

  return (
    <TableCell className="sticky-column sticky-left-0 border-r font-medium py-1 text-center">
      <Tooltip>
        <TooltipTrigger asChild>
          <span>{getFirstName()}</span>
        </TooltipTrigger>
        <TooltipContent>
          <p>{getMemberName()}</p>
        </TooltipContent>
      </Tooltip>
    </TableCell>
  );
};
