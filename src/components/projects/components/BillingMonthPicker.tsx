
import React from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, addYears, subYears } from 'date-fns';
import { cn } from "@/lib/utils";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface BillingMonthPickerProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
}

export const BillingMonthPicker = ({ value, onChange }: BillingMonthPickerProps) => {
  const [calendarDate, setCalendarDate] = React.useState<Date>(value || new Date());

  const onMonthSelect = (date: Date | undefined) => {
    if (date) {
      onChange(date);
      setCalendarDate(date);
    }
  };

  const handleYearChange = (year: number) => {
    const newDate = new Date(calendarDate);
    newDate.setFullYear(year);
    setCalendarDate(newDate);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  const navigateYear = (direction: 'prev' | 'next') => {
    const newDate = direction === 'prev' 
      ? subYears(calendarDate, 1)
      : addYears(calendarDate, 1);
    setCalendarDate(newDate);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal h-8",
            !value && "text-muted-foreground"
          )}
        >
          {value ? format(value, "MMMM yyyy") : "Select billing month"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => navigateYear('prev')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            {/* Year Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-8 px-4">
                  {calendarDate.getFullYear()}
                  <ChevronRight className="h-4 w-4 rotate-90 ml-2 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="max-h-[300px] overflow-y-auto">
                {years.map((year) => (
                  <DropdownMenuItem 
                    key={year} 
                    onClick={() => handleYearChange(year)}
                    className={cn(
                      calendarDate.getFullYear() === year && "bg-accent text-accent-foreground"
                    )}
                  >
                    {year}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => navigateYear('next')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Calendar
            mode="single"
            selected={value}
            onSelect={onMonthSelect}
            defaultMonth={calendarDate}
            month={calendarDate}
            className={cn("p-0 pointer-events-auto")}
            disabled={(date) => {
              return date.getDate() !== 1;
            }}
            formatters={{
              formatCaption: () => ''
            }}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};
