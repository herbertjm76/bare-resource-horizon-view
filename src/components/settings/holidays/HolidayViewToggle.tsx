
import React from 'react';
import { Button } from "@/components/ui/button";
import { Calendar, List } from 'lucide-react';

interface HolidayViewToggleProps {
  view: 'list' | 'calendar';
  onViewChange: (view: 'list' | 'calendar') => void;
}

export const HolidayViewToggle: React.FC<HolidayViewToggleProps> = ({
  view,
  onViewChange
}) => {
  return (
    <div className="flex gap-1 border rounded-md p-1">
      <Button
        variant={view === 'list' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('list')}
        className="flex items-center gap-2"
      >
        <List className="h-4 w-4" />
        List
      </Button>
      <Button
        variant={view === 'calendar' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('calendar')}
        className="flex items-center gap-2"
      >
        <Calendar className="h-4 w-4" />
        Calendar
      </Button>
    </div>
  );
};
