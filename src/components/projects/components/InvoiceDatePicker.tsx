
import React from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, addYears, subYears } from 'date-fns';
import { cn } from "@/lib/utils";

interface InvoiceDatePickerProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  onToday: () => void;
}

export const InvoiceDatePicker = ({ value, onChange, onToday }: InvoiceDatePickerProps) => {
  const [calendarDate, setCalendarDate] = React.useState<Date>(value || new Date());

  const onDateSelect = (date: Date | undefined) => {
    if (date) {
      onChange(date);
      setCalendarDate(date);
    }
  };

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
          {value ? format(value, "MM/dd/yyyy") : "Select date"}
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
            <span className="font-semibold">
              {format(calendarDate, "yyyy")}
            </span>
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
            onSelect={onDateSelect}
            defaultMonth={calendarDate}
            className={cn("p-0 pointer-events-auto")}
            formatters={{
              formatCaption: (date) => format(date, "MMMM")
            }}
          />
          <div className="mt-3">
            <Button
              variant="outline"
              className="w-full text-sm"
              onClick={onToday}
              type="button"
            >
              Today
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
