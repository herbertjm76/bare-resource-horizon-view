
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
  // Period options for the dropdown with week labels instead of day labels
  const periodOptions = [
    { value: '12', label: '12 Weeks' },
    { value: '16', label: '16 Weeks' },
    { value: '24', label: '24 Weeks' },
    { value: '52', label: '52 Weeks' }
  ];

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Period to Display</label>
      <Select
        value={selectedPeriod.toString()}
        onValueChange={(value) => onPeriodChange(Number(value))}
      >
        <SelectTrigger className="w-full bg-background">
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
