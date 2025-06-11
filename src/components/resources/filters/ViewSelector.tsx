
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type ViewOption = '1-month' | '3-months' | '12-months';

interface ViewSelectorProps {
  selectedView: ViewOption;
  onViewChange: (view: ViewOption) => void;
}

export const ViewSelector: React.FC<ViewSelectorProps> = ({
  selectedView,
  onViewChange
}) => {
  const viewOptions = [
    { value: '1-month' as const, label: '1 month' },
    { value: '3-months' as const, label: '3 months' },
    { value: '12-months' as const, label: '12 months' }
  ];

  return (
    <Select 
      value={selectedView}
      onValueChange={onViewChange}
    >
      <SelectTrigger className="w-[140px] bg-white border-slate-200">
        <div className="flex items-center">
          <span className="text-xs mr-2 text-muted-foreground">View:</span>
          <SelectValue placeholder="Select view" />
        </div>
      </SelectTrigger>
      <SelectContent>
        {viewOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
