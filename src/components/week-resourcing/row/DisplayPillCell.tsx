
import React from 'react';
import { TableCell } from '@/components/ui/table';

interface DisplayPillCellProps {
  value: number;
  label: string;
  className?: string;
  pillClassName?: string;
}

export const DisplayPillCell: React.FC<DisplayPillCellProps> = ({
  value,
  label,
  className = '',
  pillClassName = ''
}) => {
  return (
    <TableCell className={`text-center border-r p-1 ${className}`}>
      <div
        className={`inline-flex items-center justify-center w-8 h-6 text-xs font-medium rounded-lg ${pillClassName}`}
      >
        {value || 0}{label}
      </div>
    </TableCell>
  );
};
