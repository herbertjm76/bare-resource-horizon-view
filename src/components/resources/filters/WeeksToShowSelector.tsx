
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface WeeksToShowSelectorProps {
  weeksToShow: number;
  onWeeksChange: (weeks: number) => void;
}

export const WeeksToShowSelector: React.FC<WeeksToShowSelectorProps> = ({
  weeksToShow,
  onWeeksChange
}) => {
  // Week options for the dropdown
  const weekOptions = [
    { value: '8', label: '8 Weeks' },
    { value: '12', label: '12 Weeks' },
    { value: '16', label: '16 Weeks' },
    { value: '26', label: '26 Weeks' },
    { value: '52', label: '52 Weeks' },
  ];

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Weeks to Show</label>
      <Select
        value={weeksToShow.toString()}
        onValueChange={(value) => onWeeksChange(Number(value))}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select period" />
        </SelectTrigger>
        <SelectContent>
          {weekOptions.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
