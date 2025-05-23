
import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface DisplayOptionsProps {
  showWeekends: boolean;
  onToggleWeekends: (show: boolean) => void;
  showWorkdaysOnly: boolean;
  onToggleWorkdays: (workdaysOnly: boolean) => void;
}

export const DisplayOptions: React.FC<DisplayOptionsProps> = ({
  showWeekends,
  onToggleWeekends,
  showWorkdaysOnly,
  onToggleWorkdays
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium mb-2">Display Options</h3>
      
      <div className="flex items-center justify-between">
        <Label htmlFor="show-weekends" className="cursor-pointer">
          Show Weekends
        </Label>
        <Switch 
          id="show-weekends" 
          checked={showWeekends} 
          onCheckedChange={onToggleWeekends}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <Label htmlFor="workdays-only" className="cursor-pointer">
          Show Workdays Only (Mon-Fri)
        </Label>
        <Switch 
          id="workdays-only" 
          checked={showWorkdaysOnly} 
          onCheckedChange={onToggleWorkdays}
          disabled={!showWeekends} // Can't hide workdays if weekends are hidden
        />
      </div>
    </div>
  );
};
