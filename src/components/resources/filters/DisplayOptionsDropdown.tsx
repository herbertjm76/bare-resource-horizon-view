
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';

interface DisplayOptionsDropdownProps {
  displayOptions: {
    showWeekends: boolean;
    selectedDays: string[];
    weekStartsOnSunday: boolean;
  };
  onDisplayOptionChange: (key: string, value: any) => void;
  onClose: () => void;
}

export const DisplayOptionsDropdown: React.FC<DisplayOptionsDropdownProps> = ({
  displayOptions,
  onDisplayOptionChange,
  onClose
}) => {
  const dayOptions = [
    { id: 'mon', label: 'Monday' },
    { id: 'tue', label: 'Tuesday' },
    { id: 'wed', label: 'Wednesday' },
    { id: 'thu', label: 'Thursday' },
    { id: 'fri', label: 'Friday' },
    { id: 'sat', label: 'Saturday' },
    { id: 'sun', label: 'Sunday' }
  ];

  const handleDayToggle = (dayId: string, checked: boolean) => {
    const newSelectedDays = checked
      ? [...displayOptions.selectedDays, dayId]
      : displayOptions.selectedDays.filter(d => d !== dayId);
    
    onDisplayOptionChange('selectedDays', newSelectedDays);
  };

  return (
    <div className="space-y-4 p-4">
      <div className="space-y-3">
        <h4 className="font-medium text-sm">Display Options</h4>
        
        {/* Show Weekends Toggle */}
        <div className="flex items-center justify-between">
          <Label htmlFor="show-weekends" className="text-sm">Show Weekends</Label>
          <Switch
            id="show-weekends"
            checked={displayOptions.showWeekends}
            onCheckedChange={(checked) => onDisplayOptionChange('showWeekends', checked)}
          />
        </div>

        {/* Week Start Day Toggle */}
        <div className="flex items-center justify-between">
          <Label htmlFor="week-starts-sunday" className="text-sm">Week Starts on Sunday</Label>
          <Switch
            id="week-starts-sunday"
            checked={displayOptions.weekStartsOnSunday}
            onCheckedChange={(checked) => onDisplayOptionChange('weekStartsOnSunday', checked)}
          />
        </div>

        {/* Visible Days Selection */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Visible Days</Label>
          <div className="grid grid-cols-2 gap-2">
            {dayOptions.map((day) => (
              <div key={day.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`day-${day.id}`}
                  checked={displayOptions.selectedDays.includes(day.id)}
                  onCheckedChange={(checked) => handleDayToggle(day.id, checked as boolean)}
                />
                <Label htmlFor={`day-${day.id}`} className="text-sm">
                  {day.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
};
