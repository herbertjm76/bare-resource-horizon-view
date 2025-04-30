
import React from 'react';
import { Button } from "@/components/ui/button";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

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
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground mr-2">{weekLabel}</span>
      <div className="flex items-center border rounded-md">
        <Button variant="ghost" size="icon" onClick={onPreviousWeek}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="flex items-center px-2">
          <Calendar className="h-4 w-4" />
        </span>
        <Button variant="ghost" size="icon" onClick={onNextWeek}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
