
import React from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  const [selectedYear, setSelectedYear] = React.useState<number>(
    value?.getFullYear() || new Date().getFullYear()
  );
  const [open, setOpen] = React.useState(false);

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const handleYearChange = (increment: number) => {
    setSelectedYear(prev => prev + increment);
  };

  const handleMonthSelect = (monthIndex: number) => {
    if (!value) {
      const newDate = new Date(selectedYear, monthIndex, 1);
      onChange(newDate);
    } else {
      const newDate = new Date(selectedYear, monthIndex);
      onChange(newDate);
    }
    setOpen(false); // Close the popover after selection
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
        className="p-0 w-64 bg-popover z-[100]" 
        align="start"
        sideOffset={4}
        onInteractOutside={(e) => {
          e.preventDefault();
          setOpen(false);
        }}
      >
        <div 
          className="p-4" 
          onClick={(e) => e.stopPropagation()}
          onPointerDownCapture={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <Button
              type="button"
              variant="outline"
              className="h-7 w-7 p-0"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleYearChange(-1);
              }}
            >
              <ChevronLeft className="h-4 w-4 pointer-events-none" />
            </Button>
            <div className="font-semibold">{selectedYear}</div>
            <Button
              type="button"
              variant="outline"
              className="h-7 w-7 p-0"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleYearChange(1);
              }}
            >
              <ChevronRight className="h-4 w-4 pointer-events-none" />
            </Button>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {months.map((month, index) => (
              <Button
                key={month}
                type="button"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleMonthSelect(index);
                }}
                variant="ghost"
                className={cn(
                  "h-8",
                  value?.getMonth() === index && 
                  value?.getFullYear() === selectedYear && 
                  "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                )}
              >
                {month}
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
