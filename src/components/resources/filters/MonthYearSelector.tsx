
import React from 'react';
import { Button } from "@/components/ui/button";
import { format, addMonths, subMonths, addYears, subYears } from 'date-fns';
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from '@/lib/utils';

interface MonthYearSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export const MonthYearSelector: React.FC<MonthYearSelectorProps> = ({
  selectedDate,
  onDateChange
}) => {
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);

  const handlePreviousMonth = () => {
    onDateChange(subMonths(selectedDate, 1));
  };
  
  const handleNextMonth = () => {
    onDateChange(addMonths(selectedDate, 1));
  };
  
  const handlePreviousYear = () => {
    onDateChange(subYears(selectedDate, 1));
  };
  
  const handleNextYear = () => {
    onDateChange(addYears(selectedDate, 1));
  };
  
  return (
    <div className="flex items-center justify-center space-x-1 py-2 px-4 bg-card rounded-md shadow-sm">
      {/* Year navigation */}
      <div className="flex items-center mr-2">
        <Button variant="ghost" size="icon" onClick={handlePreviousYear} className="h-7 w-7">
          <ChevronLeft className="h-3.5 w-3.5" />
          <ChevronLeft className="h-3.5 w-3.5 -ml-2" />
          <span className="sr-only">Previous year</span>
        </Button>
        
        <div className="text-sm font-medium px-1">
          {format(selectedDate, 'yyyy')}
        </div>
        
        <Button variant="ghost" size="icon" onClick={handleNextYear} className="h-7 w-7">
          <ChevronRight className="h-3.5 w-3.5" />
          <ChevronRight className="h-3.5 w-3.5 -ml-2" />
          <span className="sr-only">Next year</span>
        </Button>
      </div>
      
      {/* Month navigation */}
      <div className="flex items-center">
        <Button variant="outline" size="icon" onClick={handlePreviousMonth} className="h-8 w-8">
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous month</span>
        </Button>
        
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className={cn(
                "w-[140px] justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(selectedDate, 'MMMM yyyy')}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                if (date) {
                  onDateChange(date);
                  setIsCalendarOpen(false);
                }
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        
        <Button variant="outline" size="icon" onClick={handleNextMonth} className="h-8 w-8">
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next month</span>
        </Button>
      </div>
    </div>
  );
};
