
import React from 'react';
import { Button } from "@/components/ui/button";
import { format, addMonths, subMonths } from 'date-fns';
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
  
  return (
    <div className="flex items-center space-x-2">
      <Button variant="outline" size="icon" onClick={handlePreviousMonth} className="h-9 w-9">
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous month</span>
      </Button>
      
      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
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
      
      <Button variant="outline" size="icon" onClick={handleNextMonth} className="h-9 w-9">
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next month</span>
      </Button>
    </div>
  );
};
