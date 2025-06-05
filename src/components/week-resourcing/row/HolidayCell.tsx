
import React from 'react';
import { TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';

interface HolidayCellProps {
  memberId: string;
  memberOffice: string;
  weekStartDate: string;
  onLeaveInputChange: (memberId: string, leaveType: string, value: string) => void;
}

export const HolidayCell: React.FC<HolidayCellProps> = ({
  memberId,
  memberOffice,
  weekStartDate,
  onLeaveInputChange
}) => {
  return (
    <TableCell className="text-center border-r p-1">
      <div className="flex items-center justify-center">
        <Input
          type="number"
          min="0"
          max="40"
          defaultValue={0}
          onChange={(e) => onLeaveInputChange(memberId, 'holiday', e.target.value)}
          className="w-12 h-8 text-xs text-center border-2 border-gray-300 rounded-lg bg-gray-50 focus:border-gray-500 focus:bg-white transition-all"
          placeholder="0"
        />
      </div>
    </TableCell>
  );
};
