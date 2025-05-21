
import React from 'react';
import { TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';

interface LeaveInputCellProps {
  leaveValue: number;
  leaveType: 'sick' | 'other';
  memberId: string;
  bgColor: string;
  onLeaveInputChange: (memberId: string, leaveType: string, value: string) => void;
}

export const LeaveInputCell: React.FC<LeaveInputCellProps> = ({ 
  leaveValue, 
  leaveType, 
  memberId, 
  bgColor, 
  onLeaveInputChange 
}) => {
  return (
    <TableCell className="border-r p-0 text-center w-[80px]">
      <div className="allocation-input-container">
        <Input
          type="number"
          min="0"
          max="40"
          value={leaveValue || ''}
          onChange={(e) => onLeaveInputChange(memberId, leaveType, e.target.value)}
          className={`w-full h-8 text-center p-0 ${bgColor}`}
          placeholder="0"
        />
      </div>
    </TableCell>
  );
};
