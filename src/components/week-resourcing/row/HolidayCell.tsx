
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
      <div className="w-full h-8 p-1 bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300 text-gray-700 rounded-lg font-medium text-xs flex items-center justify-center cursor-default">
        {holidayHours || 0}h
      </div>
    </TableCell>
  );
};
