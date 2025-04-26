
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { format, setMonth, setYear } from "date-fns";
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

  const months = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December"
  ];

  const handleYearChange = (increment: number) => {
    setSelectedYear(prev => prev + increment);
  };

  const handleMonthSelect = (monthIndex: number) => {
    if (!value) {
      const newDate = new Date(selectedYear, monthIndex, 1);
      onChange(newDate);
    } else {
      const newDate = setMonth(setYear(value, selectedYear), monthIndex);
      onChange(newDate);
    }
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
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
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="p-0 w-[280px] z-[60] bg-popover" 
        align="start"
      >
        <div className="p-3">
          <div className="flex items-center justify-between mb-4">
            <Button
              type="button"
              variant="outline"
              className="h-7 w-7 p-0"
              onClick={() => handleYearChange(-1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="font-semibold">{selectedYear}</div>
            <Button
              type="button"
              variant="outline"
              className="h-7 w-7 p-0"
              onClick={() => handleYearChange(1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {months.map((month, index) => (
              <Button
                key={month}
                type="button"
                onClick={() => handleMonthSelect(index)}
                variant="ghost"
                className={cn(
                  "h-9",
                  value?.getMonth() === index && 
                  value?.getFullYear() === selectedYear && 
                  "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                )}
              >
                {month.slice(0, 3)}
              </Button>
            ))}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
