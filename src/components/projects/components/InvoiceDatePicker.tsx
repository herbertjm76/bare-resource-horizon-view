
import React from 'react';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format, addMonths, subMonths } from 'date-fns';
import { cn } from "@/lib/utils";
import { DatePickerNavigation } from './datepicker/DatePickerNavigation';
import { DatePickerCalendar } from './datepicker/DatePickerCalendar';

interface InvoiceDatePickerProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  onToday: () => void;
  showIcon?: boolean;
}

export const InvoiceDatePicker = ({ 
  value, 
  onChange, 
  onToday, 
  showIcon = true
}: InvoiceDatePickerProps) => {
  const [calendarDate, setCalendarDate] = React.useState<Date>(value || new Date());
  const [open, setOpen] = React.useState(false);

  const onDateSelect = (date: Date | undefined) => {
    if (date) {
      onChange(date);
      setCalendarDate(date);
      setOpen(false);
    }
  };

  const handleMonthChange = (monthIndex: number) => {
    const newDate = new Date(calendarDate);
    newDate.setMonth(monthIndex);
    setCalendarDate(newDate);
  };

  const handleYearChange = (year: number) => {
    const newDate = new Date(calendarDate);
    newDate.setFullYear(year);
    setCalendarDate(newDate);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = direction === 'prev' 
      ? subMonths(calendarDate, 1)
      : addMonths(calendarDate, 1);
    setCalendarDate(newDate);
  };

  const handleTodayClick = () => {
    onToday();
    setOpen(false);
  };

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

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
          {value ? format(value, "MM/dd/yyyy") : "Select date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-auto p-0 z-[60] bg-popover shadow-md" 
        align="start"
        sideOffset={4}
        avoidCollisions={true}
        collisionPadding={8}
        sticky="always"
      >
        <div className="p-3 pointer-events-auto">
          <DatePickerNavigation
            currentMonth={calendarDate.getMonth()}
            currentYear={calendarDate.getFullYear()}
            months={months}
            years={years}
            onMonthChange={handleMonthChange}
            onYearChange={handleYearChange}
            onNavigateMonth={navigateMonth}
          />

          <DatePickerCalendar
            calendarDate={calendarDate}
            selected={value}
            onSelect={onDateSelect}
            onMonthChange={setCalendarDate}
          />

          <div className="mt-3">
            <Button
              variant="outline"
              className="w-full text-sm"
              onClick={(e) => {
                e.stopPropagation();
                handleTodayClick();
              }}
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
