
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from 'lucide-react';

interface WeekViewSelectorProps {
  selectedWeeks: number;
  onWeeksChange: (weeks: number) => void;
  className?: string;
}

export const WeekViewSelector: React.FC<WeekViewSelectorProps> = ({
  selectedWeeks,
  onWeeksChange,
  className
}) => {
  const weekOptions = [
    { value: 12, label: '12 Weeks' },
    { value: 24, label: '24 Weeks' },
    { value: 36, label: '36 Weeks' }
  ];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Calendar className="h-4 w-4 text-gray-500" />
      <Select value={selectedWeeks.toString()} onValueChange={(value) => onWeeksChange(Number(value))}>
        <SelectTrigger className="w-32 h-8">
          <SelectValue placeholder="Select period" />
        </SelectTrigger>
        <SelectContent>
          {weekOptions.map(option => (
            <SelectItem key={option.value} value={option.value.toString()}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
