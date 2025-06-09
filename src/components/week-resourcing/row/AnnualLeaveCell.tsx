
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
      <div className="w-full h-8 p-1 bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300 text-gray-700 rounded-lg font-medium text-xs flex items-center justify-center cursor-default">
        {annualLeave || 0}h
      </div>
    </TableCell>
  );
};
