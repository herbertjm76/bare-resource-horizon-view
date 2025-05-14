
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, addWeeks, subWeeks, startOfWeek } from 'date-fns';

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
        {weekLabel}
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
