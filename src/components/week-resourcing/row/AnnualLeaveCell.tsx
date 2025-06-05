
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
      pillClassName="bg-gradient-to-r from-blue-100 to-blue-200 border-blue-300 text-blue-800"
    />
  );
};
