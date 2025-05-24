
import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface DisplayOptionsProps {
  showWeekends: boolean;
  onToggleWeekends: (show: boolean) => void;
  selectedDays: string[];
  onSelectedDaysChange: (days: string[]) => void;
  weekStartsOnSunday: boolean;
  onWeekStartChange: (startsOnSunday: boolean) => void;
}

// Only weekdays
const weekdays = [
  { id: 'mon', name: 'Monday' },
  { id: 'tue', name: 'Tuesday' },
  { id: 'wed', name: 'Wednesday' },
  { id: 'thu', name: 'Thursday' },
  { id: 'fri', name: 'Friday' },
];

export const DisplayOptions: React.FC<DisplayOptionsProps> = ({
  showWeekends,
  onToggleWeekends,
  selectedDays = ['mon', 'tue', 'wed', 'thu', 'fri'], // Default to weekdays only
  onSelectedDaysChange,
  weekStartsOnSunday,
  onWeekStartChange
}) => {
  
  // Handler for toggling a day in selection
  const handleDayToggle = (day: string) => {
    if (selectedDays.includes(day)) {
      // Remove day if already selected
      onSelectedDaysChange(selectedDays.filter(d => d !== day));
    } else {
      // Add day if not selected
      onSelectedDaysChange([...selectedDays, day]);
    }
  };

  // Handler for weekend toggle - this should add/remove Saturday and Sunday together
  const handleWeekendToggle = (show: boolean) => {
    let updatedDays = [...selectedDays];
    
    if (show) {
      // Add weekend days if not already included
      if (!updatedDays.includes('sat')) updatedDays.push('sat');
      if (!updatedDays.includes('sun')) updatedDays.push('sun');
    } else {
      // Remove weekend days
      updatedDays = updatedDays.filter(day => day !== 'sat' && day !== 'sun');
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
      
      <div>
        <p className="text-sm font-medium mb-2">Weekdays to Display</p>
        <div className="grid grid-cols-1 gap-2">
          {weekdays.map(day => (
            <div key={day.id} className="flex items-center space-x-2">
              <Checkbox 
                id={`day-${day.id}`}
                checked={selectedDays.includes(day.id)}
                onCheckedChange={() => handleDayToggle(day.id)}
              />
              <Label 
                htmlFor={`day-${day.id}`} 
                className="cursor-pointer text-sm"
              >
                {day.name}
              </Label>
            </div>
          ))}
        </div>
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
