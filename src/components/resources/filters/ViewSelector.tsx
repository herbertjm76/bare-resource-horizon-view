
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
      icon: <Calendar className="h-3.5 w-3.5" />
    },
    { 
      value: '3-months' as const, 
      label: '3 Months View',
      description: '12 weeks',
      icon: <Clock className="h-3.5 w-3.5" />
    },
    { 
      value: '12-months' as const, 
      label: '12 Months View',
      description: '52 weeks',
      icon: <Calendar className="h-3.5 w-3.5" />
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
        <SelectTrigger className="w-[180px] bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200 focus:ring-2 focus:ring-brand-violet/20">
          <div className="flex items-center gap-2">
            {currentOption?.icon}
            <div className="flex flex-col items-start">
              <SelectValue placeholder="Select view" />
              {currentOption && (
                <span className="text-xs text-muted-foreground">
                  {currentOption.description}
                </span>
              )}
            </div>
          </div>
        </SelectTrigger>
        <SelectContent className="bg-white border border-slate-200 shadow-lg rounded-lg overflow-hidden">
          {viewOptions.map((option) => (
            <SelectItem 
              key={option.value} 
              value={option.value}
              className="hover:bg-brand-violet/5 focus:bg-brand-violet/10 cursor-pointer transition-colors duration-150"
            >
              <div className="flex items-center gap-3 py-1">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-violet/10">
                  {option.icon}
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900">{option.label}</span>
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
