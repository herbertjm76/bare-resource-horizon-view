
import React from 'react';
import { ManualInputCell } from './ManualInputCell';

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
    <ManualInputCell
      value={0}
      memberId={memberId}
      field="holiday"
      placeholder="0"
      onInputChange={onLeaveInputChange}
      className="leave-column"
    />
  );
};
