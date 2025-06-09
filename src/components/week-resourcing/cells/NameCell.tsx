
import React from 'react';
import { TableCell } from '@/components/ui/table';

interface NameCellProps {
  member: any;
}

export const NameCell: React.FC<NameCellProps> = ({ member }) => {
  return (
    <TableCell className="font-medium border-r bg-white sticky left-0 z-10 min-w-[120px] max-w-[150px] shadow-[2px_0_4px_rgba(0,0,0,0.1)]">
      <div className="truncate px-2 text-sm" title={`${member.first_name} ${member.last_name}`}>
        <span className="hidden sm:inline">{member.first_name} {member.last_name}</span>
        <span className="sm:hidden">{member.first_name.substring(0, 1)}. {member.last_name}</span>
      </div>
    </TableCell>
  );
};
