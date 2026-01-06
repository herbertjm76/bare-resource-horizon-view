
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
      updatedDays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    } else {
      // Only include weekdays based on week start preference
      if (weekStartsOnSunday) {
        // Sunday start: weekdays are Sun, Mon, Tue, Wed, Thu (Fri, Sat are weekends)
        updatedDays = ['sun', 'mon', 'tue', 'wed', 'thu'];
      } else {
        // Monday start: weekdays are Mon, Tue, Wed, Thu, Fri (Sat, Sun are weekends)
        updatedDays = ['mon', 'tue', 'wed', 'thu', 'fri'];
      }
    }
    
    // Update both the weekend toggle and selected days
    onToggleWeekends(show);
    onSelectedDaysChange(updatedDays);
  };

  // Handler for week start change - update selected days accordingly
  const handleWeekStartChange = (startsOnSunday: boolean) => {
    onWeekStartChange(startsOnSunday);
    
    // Update selected days based on current weekend setting and new week start
    let updatedDays: string[];
    
    if (showWeekends) {
      // Show all days regardless of week start
      updatedDays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    } else {
      // Only show weekdays based on new week start preference
      if (startsOnSunday) {
        // Sunday start: weekdays are Sun, Mon, Tue, Wed, Thu
        updatedDays = ['sun', 'mon', 'tue', 'wed', 'thu'];
      } else {
        // Monday start: weekdays are Mon, Tue, Wed, Thu, Fri
        updatedDays = ['mon', 'tue', 'wed', 'thu', 'fri'];
      }
    }
    
    onSelectedDaysChange(updatedDays);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium mb-2">Display Settings</h3>
      
      <div className="flex items-center justify-between">
        <Label htmlFor="week-start" className="cursor-pointer">
          Week starts on Sunday
        </Label>
        <Switch 
          id="week-start" 
          checked={weekStartsOnSunday} 
          onCheckedChange={handleWeekStartChange}
        />
      </div>
    </div>
  );
};
