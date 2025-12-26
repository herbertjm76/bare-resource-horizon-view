
import React, { useState } from 'react';
import { format, addDays, subDays } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "./badge";

export type DateRange = {
  from: Date;
  to: Date;
};

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  className?: string;
}

export function DateRangePicker({
  value,
  onChange,
  className,
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false);

  const selectPreset = (preset: { from: Date; to: Date }) => {
    onChange(preset);
    setOpen(false);
  };

  // Date range presets
  const presets = [
    {
      name: 'This Week',
      from: new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 1)),
      to: addDays(new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 1)), 6),
    },
    {
      name: 'Next Week',
      from: addDays(new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 1)), 7),
      to: addDays(new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 1)), 13),
    },
    {
      name: 'This Month',
      from: new Date(new Date().setDate(1)),
      to: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    },
    {
      name: 'Next Month',
      from: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
      to: new Date(new Date().getFullYear(), new Date().getMonth() + 2, 0),
    },
    {
      name: 'Next Quarter',
      from: (() => {
        const today = new Date();
        const currentQuarter = Math.floor(today.getMonth() / 3);
        const nextQuarterFirstMonth = (currentQuarter + 1) % 4 * 3;
        return new Date(today.getFullYear() + (nextQuarterFirstMonth < today.getMonth() ? 1 : 0), nextQuarterFirstMonth, 1);
      })(),
      to: (() => {
        const today = new Date();
        const currentQuarter = Math.floor(today.getMonth() / 3);
        const nextQuarterLastMonth = (currentQuarter + 1) % 4 * 3 + 2;
        const year = today.getFullYear() + (nextQuarterLastMonth < today.getMonth() ? 1 : 0);
        return new Date(year, nextQuarterLastMonth + 1, 0);
      })(),
    }
  ];

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "w-[300px] justify-start text-left font-normal border-border bg-background hover:bg-muted",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-theme-primary" />
            <div className="flex-1 flex items-center">
              {format(value.from, "MMM dd, yyyy")} - {format(value.to, "MMM dd, yyyy")}
            </div>
            <ChevronDown className="ml-2 h-4 w-4 text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="px-4 pt-3 pb-2 border-b">
            <h3 className="font-medium text-sm">Date Range</h3>
            <p className="text-xs text-muted-foreground pt-1">Select a date range to filter resources</p>
          </div>
          <div className="grid grid-cols-2 gap-2 p-3">
            <div className="space-y-4">
              <h4 className="text-xs font-medium">Quick Select</h4>
              <div className="flex flex-col gap-2">
                {presets.map((preset) => (
                  <Button
                    key={preset.name}
                    variant="outline"
                    size="sm"
                    className="justify-start text-xs"
                    onClick={() => selectPreset(preset)}
                  >
                    {preset.name}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <div className="grid gap-2">
                <div className="grid gap-1">
                  <Calendar
                    mode="range"
                    selected={{
                      from: value.from,
                      to: value.to,
                    }}
                    onSelect={(range) => {
                      if (range?.from && range?.to) {
                        onChange({
                          from: range.from,
                          to: range.to,
                        });
                      }
                    }}
                    numberOfMonths={1}
                    defaultMonth={value.from}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 p-3 pt-0">
            <Button
              size="sm" 
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              size="sm"
              onClick={() => setOpen(false)}
            >
              Apply
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
