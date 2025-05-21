
import React from 'react';
import { TableCell } from '@/components/ui/table';
import { LeaveTooltip } from '../LeaveTooltip';

interface LeaveDayType {
  date: string;
  hours: number;
}

interface AnnualLeaveCellProps {
  annualLeave: number;
  leaveDays: LeaveDayType[];
}

export const AnnualLeaveCell: React.FC<AnnualLeaveCellProps> = ({ annualLeave, leaveDays }) => {
  return (
    <TableCell className="border-r p-0 text-center w-[80px]">
      <LeaveTooltip leaveDays={leaveDays}>
        <div className={`w-full h-8 flex items-center justify-center ${annualLeave > 0 ? 'bg-[#F2FCE2]' : ''}`}>
          {annualLeave > 0 ? annualLeave : '—'}
        </div>
      </LeaveTooltip>
    </TableCell>
  );
};
