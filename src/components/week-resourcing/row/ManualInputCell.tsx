
import React, { useState } from 'react';
import { TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface ManualInputCellProps {
  memberId: string;
  field: string;
  value: string | number;
  onInputChange: (memberId: string, field: string, value: string | number) => void;
  className?: string;
}

export const ManualInputCell: React.FC<ManualInputCellProps> = ({
  memberId,
  field,
  value,
  onInputChange,
  className
}) => {
  const [localValue, setLocalValue] = useState(value.toString());

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
  };

  const handleBlur = () => {
    const numericValue = parseFloat(localValue) || 0;
    onInputChange(memberId, field, numericValue);
  };

  return (
    <TableCell className={cn("p-1 text-center", className)}>
      <Input
        type="number"
        value={localValue}
        onChange={handleChange}
        onBlur={handleBlur}
        className="w-12 h-6 text-center text-xs"
        min="0"
        max="40"
        step="0.5"
      />
    </TableCell>
  );
};
