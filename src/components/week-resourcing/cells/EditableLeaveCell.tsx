
import React, { useState } from 'react';
import { TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface EditableLeaveCellProps {
  className?: string;
}

export const EditableLeaveCell: React.FC<EditableLeaveCellProps> = ({ className }) => {
  const [value, setValue] = useState('0');

  return (
    <TableCell className={cn("p-1 text-center", className)}>
      <Input
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-12 h-6 text-center text-xs bg-purple-50 border-purple-200 focus:border-purple-400"
        min="0"
        max="40"
        step="0.5"
      />
    </TableCell>
  );
};
