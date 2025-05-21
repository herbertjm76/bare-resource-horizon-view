
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
            <div className="w-6 h-6 rounded-full bg-gray-250 flex items-center justify-center">
              <span className="text-xs font-medium text-gray-600">{annualLeave}</span>
            </div>
          ) : (
            <span className="text-muted-foreground">-</span>
          )}
        </div>
      </LeaveTooltip>
    </TableCell>
  );
};
