
import React from 'react';
import { DisplayPillCell } from './DisplayPillCell';

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
    <DisplayPillCell
      value={annualLeave}
      label="h"
      className="leave-column"
      pillClassName="bg-gradient-to-r from-gray-100 to-gray-200 border-gray-300 text-gray-700 cursor-default"
    />
  );
};
