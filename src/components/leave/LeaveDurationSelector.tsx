import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Clock, Sun, Moon } from 'lucide-react';

interface LeaveDurationSelectorProps {
  value: 'full_day' | 'half_day_am' | 'half_day_pm';
  onChange: (value: 'full_day' | 'half_day_am' | 'half_day_pm') => void;
  disabled?: boolean;
}

export const LeaveDurationSelector: React.FC<LeaveDurationSelectorProps> = ({
  value,
  onChange,
  disabled = false
}) => {
  return (
    <RadioGroup
      value={value}
      onValueChange={(val) => onChange(val as 'full_day' | 'half_day_am' | 'half_day_pm')}
      disabled={disabled}
      className="flex flex-col gap-3"
    >
      <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors cursor-pointer">
        <RadioGroupItem value="full_day" id="full_day" />
        <Label htmlFor="full_day" className="flex items-center gap-2 cursor-pointer flex-1">
          <Clock className="w-4 h-4 text-primary" />
          <div>
            <span className="font-medium">Full Day</span>
            <p className="text-xs text-muted-foreground">8 hours per day</p>
          </div>
        </Label>
      </div>
      
      <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors cursor-pointer">
        <RadioGroupItem value="half_day_am" id="half_day_am" />
        <Label htmlFor="half_day_am" className="flex items-center gap-2 cursor-pointer flex-1">
          <Sun className="w-4 h-4 text-amber-500" />
          <div>
            <span className="font-medium">Half Day (AM)</span>
            <p className="text-xs text-muted-foreground">Morning - 4 hours</p>
          </div>
        </Label>
      </div>
      
      <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors cursor-pointer">
        <RadioGroupItem value="half_day_pm" id="half_day_pm" />
        <Label htmlFor="half_day_pm" className="flex items-center gap-2 cursor-pointer flex-1">
          <Moon className="w-4 h-4 text-indigo-500" />
          <div>
            <span className="font-medium">Half Day (PM)</span>
            <p className="text-xs text-muted-foreground">Afternoon - 4 hours</p>
          </div>
        </Label>
      </div>
    </RadioGroup>
  );
};
