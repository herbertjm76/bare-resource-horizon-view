
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface WeekSelectorProps {
  weeksToShow: number;
  onWeeksChange: (weeks: number) => void;
  weekOptions: {value: string, label: string}[];
}

export const WeekSelector: React.FC<WeekSelectorProps> = ({
  weeksToShow,
  onWeeksChange,
  weekOptions
}) => {
  return (
    <Select 
      value={weeksToShow.toString()}
      onValueChange={(value) => onWeeksChange(parseInt(value, 10))}
    >
      <SelectTrigger 
        className="w-[140px] bg-background border-border"
      >
        <div className="flex items-center">
          <span className="text-xs mr-2 text-muted-foreground">View:</span>
          <SelectValue placeholder="Weeks to show" />
        </div>
      </SelectTrigger>
      <SelectContent>
        {weekOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
