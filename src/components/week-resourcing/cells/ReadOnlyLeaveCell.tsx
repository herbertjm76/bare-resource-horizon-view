
import React from 'react';
import { TableCell } from '@/components/ui/table';
import { LeaveTooltip } from '../LeaveTooltip';

interface LeaveDay {
  date: string;
  hours: number;
}

interface ReadOnlyLeaveCellProps {
  value: number;
  leaveDays?: LeaveDay[];
  leaveType?: string;
  className?: string;
}

export const ReadOnlyLeaveCell: React.FC<ReadOnlyLeaveCellProps> = ({
  value,
  leaveDays = [],
  leaveType = 'Leave',
  className = ''
}) => {
  return (
    <TableCell className={`text-center border-r p-1 ${className}`}>
      <LeaveTooltip leaveDays={leaveDays} leaveType={leaveType}>
        <span className="inline-flex items-center justify-center w-6 h-5 sm:w-8 sm:h-6 text-xs bg-muted text-muted-foreground rounded border border-border font-medium shadow-sm cursor-pointer hover:bg-muted/80 transition-colors">
          {value || ''}
        </span>
      </LeaveTooltip>
    </TableCell>
  );
};
