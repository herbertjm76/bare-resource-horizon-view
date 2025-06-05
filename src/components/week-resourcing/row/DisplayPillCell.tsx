
import React from 'react';
import { TableCell } from '@/components/ui/table';

interface DisplayPillCellProps {
  value: string | number;
  label?: string;
  className?: string;
  pillClassName?: string;
}

export const DisplayPillCell: React.FC<DisplayPillCellProps> = ({
  value,
  label,
  className = "",
  pillClassName = ""
}) => {
  return (
    <TableCell className={`text-center border-r p-2 ${className}`}>
      <div className="flex items-center justify-center">
        <div className={`
          inline-flex items-center justify-center
          px-3 py-1 
          bg-gradient-to-r from-gray-100 to-gray-200 
          border border-gray-300
          rounded-full 
          text-xs font-medium 
          text-gray-700
          shadow-sm
          min-w-8
          ${pillClassName}
        `}>
          {value}{label}
        </div>
      </div>
    </TableCell>
  );
};
