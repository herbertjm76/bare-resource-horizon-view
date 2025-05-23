
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
  // Period options for the dropdown with clearer labels
  const periodOptions = [
    { value: '12', label: '12 Weeks (3 Months)' },
    { value: '16', label: '16 Weeks (4 Months)' },
    { value: '24', label: '24 Weeks (6 Months)' },
    { value: '52', label: '52 Weeks (1 Year)' }
  ];

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Period to Display</label>
      <Select
        value={selectedPeriod.toString()}
        onValueChange={(value) => onPeriodChange(Number(value))}
      >
        <SelectTrigger className="w-full bg-white">
          <SelectValue placeholder="Select time period" />
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
