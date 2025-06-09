
import React from 'react';
import { TableCell } from '@/components/ui/table';

interface ReadOnlyLeaveCellProps {
  value: number;
  label?: string;
}

export const ReadOnlyLeaveCell: React.FC<ReadOnlyLeaveCellProps> = ({ value, label = "" }) => {
  return (
    <TableCell className="text-center border-r p-1 mobile-leave-cell bg-gradient-to-br from-gray-50 to-slate-50">
      <div className="w-full h-8 p-1 bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300 text-gray-700 rounded-lg font-medium text-xs flex items-center justify-center cursor-default">
        {value || 0}{label}
      </div>
    </TableCell>
  );
};
