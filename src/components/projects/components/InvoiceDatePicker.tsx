
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
  const [calendarDate, setCalendarDate] = React.useState<Date>(value || new Date());
  const [open, setOpen] = React.useState(false);

  const onDateSelect = (date: Date | undefined) => {
    if (date) {
      onChange(date);
      setCalendarDate(date);
      setOpen(false); // Close popover after date selection
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

  const handleTodayClick = () => {
    const today = new Date();
    onChange(today);
    setCalendarDate(today);
    onToday();
    setOpen(false);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = direction === 'prev' 
      ? subMonths(calendarDate, 1)
      : addMonths(calendarDate, 1);
    setCalendarDate(newDate);
  };

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  const currentMonth = calendarDate.getMonth();
  const currentYearValue = calendarDate.getFullYear();

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
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "MM/dd/yyyy") : "Select date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-auto p-0 z-50" 
        align="start"
        sideOffset={4}
      >
        <div className="p-3 pointer-events-auto">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => navigateMonth('prev')}
              type="button"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex gap-2">
              {/* Month Dropdown */}
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-[140px] h-8 justify-between"
                    type="button"
                  >
                    {months[currentMonth]}
                    <ChevronRight className="h-4 w-4 rotate-90 ml-2 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="start" 
                  className="max-h-[300px] overflow-y-auto z-[60]"
                >
                  {months.map((month, index) => (
                    <DropdownMenuItem 
                      key={month} 
                      onSelect={() => handleMonthChange(index)}
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
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-[100px] h-8 justify-between"
                    type="button"
                  >
                    {currentYearValue}
                    <ChevronRight className="h-4 w-4 rotate-90 ml-2 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="start" 
                  className="max-h-[300px] overflow-y-auto z-[60]"
                >
                  {years.map((year) => (
                    <DropdownMenuItem 
                      key={year} 
                      onSelect={() => handleYearChange(year)}
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

            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => navigateMonth('next')}
              type="button"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <Calendar
            key={calendarDate.toISOString()}
            mode="single"
            selected={value}
            onSelect={onDateSelect}
            month={calendarDate}
            onMonthChange={setCalendarDate}
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
