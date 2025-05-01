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
  return <div className="flex items-center gap-2">
      <span className="mr-1 text-lg font-bold text-violet-700">{weekLabel}</span>
      <div className="flex items-center border rounded-md">
        <Button variant="ghost" size="icon" onClick={onPreviousWeek} className="h-8 w-8 p-0">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="flex items-center px-2">
          <Calendar className="h-4 w-4" />
        </span>
        <Button variant="ghost" size="icon" onClick={onNextWeek} className="h-8 w-8 p-0">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>;
};