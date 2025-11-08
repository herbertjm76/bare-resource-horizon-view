import React from 'react';
import { TableCell } from '@/components/ui/table';
import { StandardizedBadge } from '@/components/ui/standardized-badge';

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
      <StandardizedBadge variant="metric" size="sm">
        {value || 0}{label}
      </StandardizedBadge>
    </TableCell>
  );
};
