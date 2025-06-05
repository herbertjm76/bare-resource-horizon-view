
import React from 'react';
import { DisplayPillCell } from './DisplayPillCell';

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
    <DisplayPillCell
      value={holidayHours}
      label="h"
      className="leave-column"
      pillClassName="bg-gradient-to-r from-gray-100 to-gray-200 border-gray-300 text-gray-700 cursor-default"
    />
  );
};
