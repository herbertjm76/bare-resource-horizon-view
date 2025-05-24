
import React from 'react';
import { Button } from "@/components/ui/button";
import { format, addMonths, subMonths, setDate } from 'date-fns';
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MonthYearSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export const MonthYearSelector: React.FC<MonthYearSelectorProps> = ({
  selectedDate,
  onDateChange
}) => {
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

  const handlePreviousMonth = () => {
    onDateChange(subMonths(selectedDate, 1));
  };
  
  const handleNextMonth = () => {
    onDateChange(addMonths(selectedDate, 1));
  };

  const currentYear = selectedDate.getFullYear();
  const currentMonth = selectedDate.getMonth();
  
  // Generate month options
  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];
  
  // Generate year options (current year - 2 to current year + 5)
  const years = [];
  const currentYearNum = new Date().getFullYear();
  for (let year = currentYearNum - 2; year <= currentYearNum + 5; year++) {
    years.push(year);
  }
  
  const handleMonthChange = (value: string) => {
    const newMonth = parseInt(value, 10);
    const newDate = new Date(currentYear, newMonth, 1);
    onDateChange(newDate);
  };
  
  const handleYearChange = (value: string) => {
    const newYear = parseInt(value, 10);
    const newDate = new Date(newYear, currentMonth, 1);
    onDateChange(newDate);
  };
  
  return (
    <div className="flex items-center space-x-2">
      <Button variant="outline" size="icon" onClick={handlePreviousMonth} className="h-9 w-9">
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous month</span>
      </Button>
      
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            className={cn(
              "w-[160px] justify-center text-center font-medium",
              !selectedDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {format(selectedDate, 'MMMM yyyy')}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4" align="start">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-sm font-medium mb-1 block">Month</label>
                  <Select
                    value={currentMonth.toString()}
                    onValueChange={handleMonthChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Month" />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((month, idx) => (
                        <SelectItem key={idx} value={idx.toString()}>
                          {month}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Year</label>
                  <Select
                    value={currentYear.toString()}
                    onValueChange={handleYearChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map(year => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      
      <Button variant="outline" size="icon" onClick={handleNextMonth} className="h-9 w-9">
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next month</span>
      </Button>
    </div>
  );
};
