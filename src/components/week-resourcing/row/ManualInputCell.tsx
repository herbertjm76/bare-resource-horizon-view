
import React from 'react';
import { TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';

interface ManualInputCellProps {
  value: string | number;
  memberId: string;
  field: string;
  placeholder?: string;
  onInputChange: (memberId: string, field: string, value: string) => void;
  className?: string;
}

export const ManualInputCell: React.FC<ManualInputCellProps> = ({
  value,
  memberId,
  field,
  placeholder = "0",
  onInputChange,
  className = ""
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onInputChange(memberId, field, e.target.value);
  };

  return (
    <TableCell className={`text-center border-r p-1 ${className}`}>
      <div className="flex items-center justify-center">
        <Input
          type="number"
          min="0"
          max="40"
          value={value}
          onChange={handleChange}
          className="w-12 h-8 text-xs text-center border-2 border-gray-300 rounded-lg bg-gray-50 focus:border-brand-violet focus:bg-white transition-all"
          placeholder={placeholder}
        />
      </div>
    </TableCell>
  );
};
