
import React from 'react';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from 'date-fns';
import { cn } from "@/lib/utils";
import { DatePickerNavigation } from './DatePickerNavigation';

interface MonthCalendarProps {
  value?: Date;
  onChange: (date?: Date) => void;
  showIcon?: boolean;
}

export const MonthCalendar = ({ 
  value, 
  onChange, 
  showIcon = true 
}: MonthCalendarProps) => {
  const [open, setOpen] = React.useState(false);
  
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  const handleMonthSelect = (month: number) => {
    const date = value ? new Date(value) : new Date();
    date.setMonth(month);
    onChange(date);
    setOpen(false);
  };

  const handleYearSelect = (year: number) => {
    const date = value ? new Date(value) : new Date();
    date.setFullYear(year);
    onChange(date);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal h-8",
            !value && "text-muted-foreground"
          )}
        >
          {showIcon && <CalendarIcon className="mr-2 h-4 w-4" />}
          {value ? format(value, "MMMM yyyy") : "Month"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3">
          {/* Year selector */}
          <div className="flex mb-3">
            <select
              className="flex-1 px-2 py-1 border border-gray-200 rounded"
              value={value ? value.getFullYear() : currentYear}
              onChange={(e) => handleYearSelect(Number(e.target.value))}
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          {/* Month buttons */}
          <div className="grid grid-cols-3 gap-1">
            {months.map((month, index) => (
              <Button
                key={month}
                variant="outline"
                size="sm"
                className={cn(
                  "h-9",
                  value && value.getMonth() === index && "bg-primary text-primary-foreground"
                )}
                onClick={() => handleMonthSelect(index)}
              >
                {month.substring(0, 3)}
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
