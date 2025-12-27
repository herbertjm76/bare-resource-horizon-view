
import React from 'react';
import { TableCell } from '@/components/ui/table';

interface ProjectAllocationCellProps {
  hours: number;
  readOnly?: boolean;
  disabled?: boolean;
}

export const ProjectAllocationCell: React.FC<ProjectAllocationCellProps> = ({ 
  hours, 
  readOnly = false, 
  disabled = false 
}) => {
  return (
    <TableCell className="border-r p-0.5 sm:p-1 mobile-project-cell bg-muted/20">
      {readOnly || disabled ? (
        <span className="inline-flex items-center justify-center w-6 h-5 sm:w-8 sm:h-6 text-xs bg-muted text-muted-foreground rounded border border-border font-medium shadow-sm">
          {hours || ''}
        </span>
      ) : (
        <input
          type="number"
          min="0"
          max="40"
          value={hours || ''}
          className="w-6 h-5 sm:w-8 sm:h-6 text-xs text-center border border-border rounded bg-background/90 hover:bg-background focus:bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          placeholder="0"
          readOnly={readOnly}
          disabled={disabled}
        />
      )}
    </TableCell>
  );
};
