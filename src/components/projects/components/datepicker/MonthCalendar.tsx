
import React, { useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface MonthCalendarProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  className?: string;
}

export const MonthCalendar: React.FC<MonthCalendarProps> = ({
  value,
  onChange,
  className
}) => {
  const [year, setYear] = useState(value?.getFullYear() || new Date().getFullYear());
  const [open, setOpen] = useState(false);

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const handleMonthClick = (monthIndex: number) => {
    const selectedDate = new Date(year, monthIndex);
    onChange(selectedDate);
    setOpen(false);
  };

  const handlePrevYear = () => {
    setYear(prev => prev - 1);
  };

  const handleNextYear = () => {
    setYear(prev => prev + 1);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal h-8",
            !value && "text-muted-foreground",
            className
          )}
        >
          <CalendarDays className="mr-2 h-4 w-4" />
          {value ? format(value, "MMMM yyyy") : "Select billing month"}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-64 p-4" 
        align="start"
        sideOffset={4}
        style={{ zIndex: 999 }}
        onInteractOutside={(e) => e.preventDefault()}
        forceMount
      >
        <div className="flex items-center justify-between mb-4 pointer-events-auto">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handlePrevYear}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-semibold">{year}</span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handleNextYear}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-2 pointer-events-auto">
          {months.map((month, index) => (
            <Button
              key={month}
              type="button"
              variant={value?.getMonth() === index && value?.getFullYear() === year ? "default" : "outline"}
              className="py-1 px-2 text-sm h-auto"
              onClick={() => handleMonthClick(index)}
            >
              {month}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
