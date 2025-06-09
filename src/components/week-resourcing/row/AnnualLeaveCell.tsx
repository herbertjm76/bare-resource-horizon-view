
import React from 'react';
import { TableCell } from '@/components/ui/table';

interface LeaveDay {
  date: string;
  hours: number;
}

interface AnnualLeaveCellProps {
  annualLeave: number;
  leaveDays: LeaveDay[];
}

export const AnnualLeaveCell: React.FC<AnnualLeaveCellProps> = ({
  annualLeave,
  leaveDays
}) => {
  return (
    <TableCell className="text-center border-r p-1">
      <span className="inline-flex items-center justify-center w-6 h-5 sm:w-8 sm:h-6 text-xs bg-gradient-to-br from-gray-100 to-slate-100 text-gray-700 rounded border border-gray-200 font-medium shadow-sm">
        {annualLeave || ''}
      </span>
    </TableCell>
  );
};
