
import React from 'react';
import { TableCell } from '@/components/ui/table';

interface EditableLeaveCellProps {
  defaultValue?: string;
  onChange?: (value: string) => void;
}

export const EditableLeaveCell: React.FC<EditableLeaveCellProps> = ({ defaultValue = "0", onChange }) => {
  return (
    <TableCell className="text-center border-r mobile-leave-cell bg-gradient-to-br from-purple-50 to-violet-50">
      <input
        type="number"
        min="0"
        max="40"
        defaultValue={defaultValue}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-6 h-5 sm:w-8 sm:h-6 text-xs text-center border-2 border-purple-300 rounded-md bg-white/80 focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200 transition-all"
        placeholder="0"
      />
    </TableCell>
  );
};
