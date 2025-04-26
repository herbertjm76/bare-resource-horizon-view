
import React from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, addMonths, subMonths } from 'date-fns';
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface BillingMonthPickerProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
}

export const BillingMonthPicker = ({ value, onChange }: BillingMonthPickerProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "MMMM yyyy") : "Select billing month"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          initialFocus
          className={cn("p-3 pointer-events-auto")}
          defaultMonth={value}
          formatters={{
            formatCaption: (date, options) => format(date, "yyyy"),
            formatMonthCaption: (date, options) => format(date, "MMMM")
          }}
          ISOWeek
          disabled={(date) => {
            // Disable dates that aren't the first of the month
            return date.getDate() !== 1;
          }}
          fromDate={new Date(2020, 0, 1)} // Start from 2020
          toDate={addMonths(new Date(), 24)} // Allow selection up to 2 years in the future
        />
      </PopoverContent>
    </Popover>
  );
};
