
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Clock } from 'lucide-react';

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
      label: '1 Month View',
      description: '4 weeks',
      icon: <Calendar className="h-4 w-4" />
    },
    { 
      value: '3-months' as const, 
      label: '3 Months View',
      description: '12 weeks',
      icon: <Clock className="h-4 w-4" />
    },
    { 
      value: '12-months' as const, 
      label: '12 Months View',
      description: '52 weeks',
      icon: <Calendar className="h-4 w-4" />
    }
  ];

  const currentOption = viewOptions.find(option => option.value === selectedView);

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-gray-700 hidden sm:block">Time Range:</span>
      <Select 
        value={selectedView}
        onValueChange={onViewChange}
      >
        <SelectTrigger className="w-[160px]">
          <div className="flex items-center gap-2">
            {currentOption?.icon}
            <SelectValue placeholder="Select view" />
          </div>
        </SelectTrigger>
        <SelectContent className="bg-white border shadow-lg">
          {viewOptions.map((option) => (
            <SelectItem 
              key={option.value} 
              value={option.value}
              className="cursor-pointer"
            >
              <div className="flex items-center gap-2">
                {option.icon}
                <div className="flex flex-col">
                  <span className="font-medium">{option.label}</span>
                  <span className="text-xs text-gray-500">{option.description}</span>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
