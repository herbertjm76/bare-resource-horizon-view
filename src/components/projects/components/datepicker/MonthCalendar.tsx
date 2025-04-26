
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

  const handleMonthClick = (e: React.MouseEvent, monthIndex: number) => {
    e.preventDefault();
    e.stopPropagation(); // Prevents Popover from auto-closing
    const selectedDate = new Date(year, monthIndex);
    onChange(selectedDate);
    setOpen(false);
  };

  const handleYearChange = (e: React.MouseEvent, direction: 'prev' | 'next') => {
    e.preventDefault();
    e.stopPropagation();
    setYear((prev) => direction === 'prev' ? prev - 1 : prev + 1);
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
      <PopoverContent className="w-64 p-4 z-50" align="start">
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={(e) => handleYearChange(e, 'prev')}
            className="text-gray-600 hover:text-black"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-semibold">{year}</span>
          <button
            type="button"
            onClick={(e) => handleYearChange(e, 'next')}
            className="text-gray-600 hover:text-black"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {months.map((month, index) => (
            <button
              key={month}
              type="button"
              onClick={(e) => handleMonthClick(e, index)}
              className={cn(
                "py-1 px-2 text-sm rounded hover:bg-gray-100 w-full text-left",
                value?.getMonth() === index && 
                value?.getFullYear() === year && 
                "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
              )}
            >
              {month}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
