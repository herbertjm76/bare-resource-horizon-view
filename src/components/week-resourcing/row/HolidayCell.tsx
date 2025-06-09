
import React from 'react';
import { TableCell } from '@/components/ui/table';

interface HolidayCellProps {
  memberId: string;
  memberOffice: string;
  weekStartDate: string;
  holidayHours: number;
  onLeaveInputChange: (memberId: string, leaveType: string, value: string) => void;
}

export const HolidayCell: React.FC<HolidayCellProps> = ({
  memberId,
  memberOffice,
  weekStartDate,
  holidayHours,
  onLeaveInputChange
}) => {
  return (
    <TableCell className="text-center border-r p-1">
      <span className="inline-flex items-center justify-center w-6 h-5 sm:w-8 sm:h-6 text-xs bg-gradient-to-br from-gray-100 to-slate-100 text-gray-700 rounded border border-gray-200 font-medium shadow-sm">
        {holidayHours || ''}
      </span>
    </TableCell>
  );
};
