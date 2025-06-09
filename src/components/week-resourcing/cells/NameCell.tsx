
import React from 'react';
import { TableCell } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface NameCellProps {
  member: any;
}

export const NameCell: React.FC<NameCellProps> = ({ member }) => {
  const memberTooltip = (
    <div className="space-y-1 text-xs">
      <p className="font-semibold">{member.first_name} {member.last_name}</p>
      {member.role && <p>Role: {member.role}</p>}
      {member.department && <p>Department: {member.department}</p>}
      {member.location && <p>Location: {member.location}</p>}
      {member.weekly_capacity && <p>Weekly Capacity: {member.weekly_capacity}h</p>}
      {member.email && <p>Email: {member.email}</p>}
    </div>
  );

  return (
    <TableCell className="font-medium border-r bg-white sticky left-0 z-10 min-w-[120px] max-w-[150px] shadow-[2px_0_4px_rgba(0,0,0,0.1)]">
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="truncate px-2 text-sm" title={`${member.first_name} ${member.last_name}`}>
            <span className="hidden sm:inline">{member.first_name} {member.last_name}</span>
            <span className="sm:hidden">{member.first_name.substring(0, 1)}. {member.last_name}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          {memberTooltip}
        </TooltipContent>
      </Tooltip>
    </TableCell>
  );
};
