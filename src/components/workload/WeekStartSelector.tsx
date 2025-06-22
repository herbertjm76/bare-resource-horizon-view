
import React from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { format, startOfWeek, addWeeks, subWeeks } from 'date-fns';
import { cn } from "@/lib/utils";

interface WeekStartSelectorProps {
  selectedWeek: Date;
  onWeekChange: (date: Date) => void;
  className?: string;
}

export const WeekStartSelector: React.FC<WeekStartSelectorProps> = ({
  selectedWeek,
  onWeekChange,
  className
}) => {
  const handlePreviousWeek = () => {
    const newWeek = subWeeks(selectedWeek, 1);
    onWeekChange(startOfWeek(newWeek, { weekStartsOn: 1 }));
  };

  const handleNextWeek = () => {
    const newWeek = addWeeks(selectedWeek, 1);
    onWeekChange(startOfWeek(newWeek, { weekStartsOn: 1 }));
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const weekStart = startOfWeek(date, { weekStartsOn: 1 });
      onWeekChange(weekStart);
    }
  };

  const weekLabel = `Week of ${format(selectedWeek, 'MMM d, yyyy')}`;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePreviousWeek}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="h-8 px-3 text-sm font-medium min-w-[160px] justify-start"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {weekLabel}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedWeek}
              onSelect={handleDateSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleNextWeek}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="text-xs text-muted-foreground">
        Starting week for 36-week analysis
      </div>
    </div>
  );
};
