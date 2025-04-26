
import React from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react";
import { format, addMonths, subMonths } from 'date-fns';
import { cn } from "@/lib/utils";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface InvoiceDatePickerProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  onToday: () => void;
}

export const InvoiceDatePicker = ({ value, onChange, onToday }: InvoiceDatePickerProps) => {
  // Use value or fallback to current date for the calendar navigation state
  const [calendarDate, setCalendarDate] = React.useState<Date>(value || new Date());
  
  // Handle date selection from the calendar
  const onDateSelect = (date: Date | undefined) => {
    if (date) {
      onChange(date);
      setCalendarDate(date);
    }
  };

  // Handle month selection from the dropdown
  const handleMonthChange = (monthIndex: number) => {
    const newDate = new Date(calendarDate);
    newDate.setMonth(monthIndex);
    setCalendarDate(newDate);
  };

  // Handle year selection from the dropdown
  const handleYearChange = (year: number) => {
    const newDate = new Date(calendarDate);
    newDate.setFullYear(year);
    setCalendarDate(newDate);
  };

  // Handle Today button click
  const handleTodayClick = () => {
    const today = new Date();
    onChange(today);
    setCalendarDate(today);
    onToday();
  };

  // Month navigation with arrows
  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = direction === 'prev' 
      ? subMonths(calendarDate, 1)
      : addMonths(calendarDate, 1);
    setCalendarDate(newDate);
  };

  // Months array for the dropdown
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Generate years array for the dropdown (current year ±5 years)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  const currentMonth = calendarDate.getMonth();
  const currentYearValue = calendarDate.getFullYear();

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
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "MM/dd/yyyy") : "Select date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3">
          <div className="flex gap-2 mb-4">
            {/* Month Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-[140px] h-8 justify-between">
                  {months[currentMonth]}
                  <ChevronRight className="h-4 w-4 rotate-90 ml-2 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="max-h-[300px] overflow-y-auto">
                {months.map((month, index) => (
                  <DropdownMenuItem 
                    key={month} 
                    onClick={() => handleMonthChange(index)}
                    className={cn(
                      "cursor-pointer",
                      currentMonth === index && "bg-accent text-accent-foreground"
                    )}
                  >
                    {month}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Year Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-[100px] h-8 justify-between">
                  {currentYearValue}
                  <ChevronRight className="h-4 w-4 rotate-90 ml-2 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="max-h-[300px] overflow-y-auto">
                {years.map((year) => (
                  <DropdownMenuItem 
                    key={year} 
                    onClick={() => handleYearChange(year)}
                    className={cn(
                      "cursor-pointer",
                      currentYearValue === year && "bg-accent text-accent-foreground"
                    )}
                  >
                    {year}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex mb-4">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 mr-auto"
              onClick={() => navigateMonth('prev')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 ml-auto"
              onClick={() => navigateMonth('next')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <Calendar
            mode="single"
            selected={value}
            onSelect={onDateSelect}
            defaultMonth={calendarDate}
            month={calendarDate}
            className="p-0 pointer-events-auto"
            formatters={{
              formatCaption: () => ""
            }}
          />
          
          <div className="mt-3">
            <Button
              variant="outline"
              className="w-full text-sm"
              onClick={handleTodayClick}
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
