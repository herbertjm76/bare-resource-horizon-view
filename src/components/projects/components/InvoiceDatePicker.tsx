
import React from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from 'date-fns';
import { cn } from "@/lib/utils";

interface InvoiceDatePickerProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  onToday: () => void;
}

export const InvoiceDatePicker = ({ value, onChange, onToday }: InvoiceDatePickerProps) => {
  const [calendarDate, setCalendarDate] = React.useState<Date>(value || new Date());
  const [showMonthPicker, setShowMonthPicker] = React.useState(false);

  const onDateSelect = (date: Date | undefined) => {
    if (date) {
      onChange(date);
      setCalendarDate(date);
    }
  };

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const currentYear = calendarDate.getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  const handleYearClick = (year: number) => {
    const newDate = new Date(calendarDate);
    newDate.setFullYear(year);
    setCalendarDate(newDate);
  };

  const handleMonthClick = (monthIndex: number) => {
    const newDate = new Date(calendarDate);
    newDate.setMonth(monthIndex);
    setCalendarDate(newDate);
    setShowMonthPicker(false);
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
          <div className="flex flex-col gap-2 mb-4">
            <div className="grid grid-cols-3 gap-1">
              {years.map((year) => (
                <Button
                  key={year}
                  variant={year === calendarDate.getFullYear() ? "default" : "outline"}
                  size="sm"
                  className="h-7"
                  onClick={() => handleYearClick(year)}
                >
                  {year}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              onClick={() => setShowMonthPicker(!showMonthPicker)}
              className="w-full justify-between"
            >
              {format(calendarDate, "MMMM")}
            </Button>
            {showMonthPicker && (
              <div className="grid grid-cols-3 gap-1">
                {months.map((month, index) => (
                  <Button
                    key={month}
                    variant={index === calendarDate.getMonth() ? "default" : "outline"}
                    size="sm"
                    className="h-7"
                    onClick={() => handleMonthClick(index)}
                  >
                    {month.slice(0, 3)}
                  </Button>
                ))}
              </div>
            )}
          </div>
          <Calendar
            mode="single"
            selected={value}
            onSelect={onDateSelect}
            defaultMonth={calendarDate}
            className={cn("p-0 pointer-events-auto")}
            formatters={{
              formatCaption: () => ""
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

