
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
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          initialFocus
          className={cn("p-3 pointer-events-auto")}
          formatters={{
            formatCaption: (date) => {
              const year = format(date, "yyyy");
              const month = format(date, "MMMM");
              return (
                <div className="flex items-center justify-between w-full px-8">
                  <span>{month}</span>
                  <span>{year}</span>
                </div>
              );
            }
          }}
          footer={
            <div className="mt-3 p-3">
              <Button
                variant="outline"
                className="w-full text-sm"
                onClick={onToday}
                type="button"
              >
                Today
              </Button>
            </div>
          }
        />
      </PopoverContent>
    </Popover>
  );
};
