
import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface DisplayOptionsProps {
  showWeekends: boolean;
  onToggleWeekends: (show: boolean) => void;
  selectedDays: string[];
  onSelectedDaysChange: (days: string[]) => void;
  weekStartsOnSunday: boolean;
  onWeekStartChange: (startsOnSunday: boolean) => void;
}

export const DisplayOptions: React.FC<DisplayOptionsProps> = ({
  showWeekends,
  onToggleWeekends,
  selectedDays,
  onSelectedDaysChange,
  weekStartsOnSunday,
  onWeekStartChange
}) => {
  
  // Handler for weekend toggle - manages weekdays and weekends based on work week start
  const handleWeekendToggle = (show: boolean) => {
    let updatedDays: string[];
    
    if (show) {
      // Include all days (weekdays + weekends)
      updatedDays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
    } else {
      // Only include weekdays (Monday to Friday)
      updatedDays = ['mon', 'tue', 'wed', 'thu', 'fri'];
    }
    
    // Update both the weekend toggle and selected days
    onToggleWeekends(show);
    onSelectedDaysChange(updatedDays);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium mb-2">Display Settings</h3>
      
      <div className="flex items-center justify-between">
        <Label htmlFor="show-weekends" className="cursor-pointer">
          Show Weekends
        </Label>
        <Switch 
          id="show-weekends" 
          checked={showWeekends} 
          onCheckedChange={handleWeekendToggle}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <Label htmlFor="week-start" className="cursor-pointer">
          Week starts on Sunday
        </Label>
        <Switch 
          id="week-start" 
          checked={weekStartsOnSunday} 
          onCheckedChange={onWeekStartChange}
        />
      </div>
    </div>
  );
};
