
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
    const newDate = new Date(selectedYear, monthIndex, 1);
    onChange(newDate);
    setOpen(false);
  };

  // Simplified implementation with direct DOM-level click handlers
  // This should bypass React's event system issues if any exist
  React.useEffect(() => {
    if (!open) return;
    
    // Add click handlers after component renders
    const addClickHandlers = () => {
      // Year navigation buttons
      const prevYearBtn = document.getElementById('month-calendar-prev-year');
      const nextYearBtn = document.getElementById('month-calendar-next-year');
      
      if (prevYearBtn) {
        prevYearBtn.onclick = (e) => {
          e.stopPropagation();
          handleYearChange(-1);
        };
      }
      
      if (nextYearBtn) {
        nextYearBtn.onclick = (e) => {
          e.stopPropagation();
          handleYearChange(1);
        };
      }
      
      // Month buttons
      months.forEach((month, index) => {
        const monthBtn = document.getElementById(`month-calendar-month-${index}`);
        if (monthBtn) {
          monthBtn.onclick = (e) => {
            e.stopPropagation();
            handleMonthSelect(index);
          };
        }
      });
    };

    // Short delay to ensure DOM elements are available
    const timeoutId = setTimeout(addClickHandlers, 50);
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [open, selectedYear]);

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
        className="w-64 p-0" 
        align="start"
        sideOffset={4}
        style={{ zIndex: 9999 }}
      >
        <div className="p-4 bg-popover rounded-md">
          <div className="flex items-center justify-between mb-4">
            <button
              id="month-calendar-prev-year"
              type="button"
              className="h-7 w-7 p-0 flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="font-semibold">{selectedYear}</div>
            <button
              id="month-calendar-next-year"
              type="button"
              className="h-7 w-7 p-0 flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {months.map((month, index) => (
              <button
                key={month}
                id={`month-calendar-month-${index}`}
                type="button"
                className={cn(
                  "h-8 text-sm px-2 py-1 rounded-md",
                  "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
                  value?.getMonth() === index && 
                  value?.getFullYear() === selectedYear && 
                  "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                )}
              >
                {month}
              </button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
