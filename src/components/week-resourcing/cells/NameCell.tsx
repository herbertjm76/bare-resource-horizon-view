
import React from 'react';
import { TableCell } from '@/components/ui/table';

interface NameCellProps {
  member: any;
}

export const NameCell: React.FC<NameCellProps> = ({ member }) => {
  return (
    <TableCell className="font-medium border-r bg-white sticky left-0 z-10 w-[150px] mobile-name-cell">
      <div className="truncate px-2 sm:px-6 text-xs sm:text-sm" title={`${member.first_name} ${member.last_name}`}>
        <span className="hidden sm:inline">{member.first_name} {member.last_name}</span>
        <span className="sm:hidden">{member.first_name.substring(0, 1)}. {member.last_name}</span>
      </div>
    </TableCell>
  );
};
