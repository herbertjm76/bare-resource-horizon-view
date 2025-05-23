
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PeriodSelectorProps {
  selectedPeriod: number;
  onPeriodChange: (period: number) => void;
}

export const PeriodSelector: React.FC<PeriodSelectorProps> = ({
  selectedPeriod,
  onPeriodChange
}) => {
  // Period options for the dropdown
  const periodOptions = [
    { value: '4', label: '4 Weeks' },
    { value: '12', label: '12 Weeks' },
    { value: '16', label: '16 Weeks' },
    { value: '24', label: '24 Weeks' }
  ];

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Period to Show</label>
      <Select
        value={selectedPeriod.toString()}
        onValueChange={(value) => onPeriodChange(Number(value))}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select period" />
        </SelectTrigger>
        <SelectContent>
          {periodOptions.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
