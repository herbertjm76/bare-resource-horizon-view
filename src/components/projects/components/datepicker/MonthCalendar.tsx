
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { format } from 'date-fns';
import { cn } from "@/lib/utils";

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

  const handleMonthSelect = (month: string) => {
    const monthIndex = months.indexOf(month);
    if (monthIndex !== -1) {
      const newDate = new Date(value || new Date());
      newDate.setMonth(monthIndex);
      onChange(newDate);
      setOpen(false);
    }
  };

  const handleYearChange = (selectedYear: string) => {
    const year = parseInt(selectedYear, 10);
    const newDate = value ? new Date(value) : new Date();
    newDate.setFullYear(year);
    onChange(newDate);
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
          type="button"
        >
          {showIcon && <CalendarIcon className="mr-2 h-4 w-4" />}
          {value ? format(value, "MMMM yyyy") : "Select Month"}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-auto p-4 bg-popover shadow-md" 
        style={{ zIndex: 999 }}
        align="start"
        sideOffset={4}
        avoidCollisions={true}
        collisionPadding={16}
      >
        <div className="mb-4 relative">
          <Select
            value={value ? value.getFullYear().toString() : currentYear.toString()}
            onValueChange={handleYearChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent 
              position="popper" 
              style={{ zIndex: 1000 }}
              className="bg-popover shadow-md pointer-events-auto"
            >
              {years.map((year) => (
                <SelectItem 
                  key={year} 
                  value={year.toString()}
                  onSelect={(e) => e.stopPropagation()}
                >
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-3 gap-2 pointer-events-auto">
          {months.map((month) => {
            const isSelected = value && value.getMonth() === months.indexOf(month);
            return (
              <Button
                key={month}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleMonthSelect(month);
                }}
                variant={isSelected ? "default" : "outline"}
                className="h-10"
                size="sm"
                type="button"
              >
                {month.substring(0, 3)}
              </Button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};
