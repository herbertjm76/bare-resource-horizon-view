import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toUTCDateKey } from '@/utils/dateKey';

const getShortWeekLabel = (selectedWeek: Date, fullLabel: string) => {
  // On mobile, show shorter format like "Jun 9" instead of "Week of Jun 9, 2025"
  // selectedWeek is already normalized to the week start (UTC-safe), so just format it
  const isMobile = window.innerWidth < 768;
  
  if (isMobile) {
    // Format from UTC date key to avoid timezone drift
    const [, month, day] = toUTCDateKey(selectedWeek).split('-');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[parseInt(month, 10) - 1]} ${parseInt(day, 10)}`;
  }
  
  return fullLabel;
};

interface WeekSelectorProps {
  selectedWeek: Date;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
  weekLabel: string;
}

export const WeekSelector: React.FC<WeekSelectorProps> = ({
  selectedWeek,
  onPreviousWeek,
  onNextWeek,
  weekLabel
}) => {
  return (
    <div className="flex items-center space-x-2 bg-background rounded-lg border p-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onPreviousWeek}
        className="h-8 w-8 p-0"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous week</span>
      </Button>
      
      <span className="text-sm font-medium px-2">
        {getShortWeekLabel(selectedWeek, weekLabel)}
      </span>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onNextWeek}
        className="h-8 w-8 p-0"
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next week</span>
      </Button>
    </div>
  );
};
