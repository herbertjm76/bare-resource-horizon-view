
import React from 'react';
import { TableCell } from '@/components/ui/table';
import { LeaveTooltip } from '../LeaveTooltip';

interface LeaveDayInfo {
  date: string;
  hours: number;
}

interface AnnualLeaveCellProps {
  annualLeave: number;
  leaveDays: LeaveDayInfo[];
}

export const AnnualLeaveCell: React.FC<AnnualLeaveCellProps> = ({ 
  annualLeave,
  leaveDays
}) => {
  return (
    <TableCell className="leave-cell text-center p-1 border-r">
      <LeaveTooltip leaveDays={leaveDays} leaveType="Annual Leave">
        <div className="w-full h-full flex justify-center items-center">
          {annualLeave > 0 ? (
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-medium">
              {annualLeave}
            </div>
          ) : (
            <span className="text-muted-foreground">-</span>
          )}
        </div>
      </LeaveTooltip>
    </TableCell>
  );
};
