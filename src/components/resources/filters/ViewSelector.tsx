
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
    { 
      value: '1-month' as const, 
      label: '1 Month'
    },
    { 
      value: '3-months' as const, 
      label: '3 Months'
    },
    { 
      value: '12-months' as const, 
      label: '12 Months'
    }
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-gray-700 hidden sm:block">Range:</span>
      <Select 
        value={selectedView}
        onValueChange={onViewChange}
      >
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Select range" />
        </SelectTrigger>
        <SelectContent className="bg-white border shadow-lg z-50">
          {viewOptions.map((option) => (
            <SelectItem 
              key={option.value} 
              value={option.value}
              className="cursor-pointer"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
