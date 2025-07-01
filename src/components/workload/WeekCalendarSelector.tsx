
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { format, startOfWeek, addWeeks, subWeeks, startOfMonth, endOfMonth, eachWeekOfInterval, getWeek, isSameWeek, addMonths, subMonths } from 'date-fns';
import { cn } from "@/lib/utils";

interface WeekCalendarSelectorProps {
  selectedWeek: Date;
  onWeekChange: (date: Date) => void;
  className?: string;
}

export const WeekCalendarSelector: React.FC<WeekCalendarSelectorProps> = ({
  selectedWeek,
  onWeekChange,
  className
}) => {
  const [currentMonth, setCurrentMonth] = useState(selectedWeek);
  const [isOpen, setIsOpen] = useState(false);

  const handleWeekSelect = (weekStart: Date) => {
    const mondayOfWeek = startOfWeek(weekStart, { weekStartsOn: 1 });
    onWeekChange(mondayOfWeek);
    setIsOpen(false);
  };

  const handlePreviousWeek = () => {
    const newWeek = subWeeks(selectedWeek, 1);
    onWeekChange(startOfWeek(newWeek, { weekStartsOn: 1 }));
  };

  const handleNextWeek = () => {
    const newWeek = addWeeks(selectedWeek, 1);
    onWeekChange(startOfWeek(newWeek, { weekStartsOn: 1 }));
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1));
  };

  const weekLabel = `Week of ${format(selectedWeek, 'MMM d, yyyy')}`;

  // Get all weeks in the current month view
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  
  // Extend to show full weeks
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = startOfWeek(monthEnd, { weekStartsOn: 1 });
  
  const weeks = eachWeekOfInterval(
    { start: calendarStart, end: addWeeks(calendarEnd, 1) },
    { weekStartsOn: 1 }
  );

  const renderWeekRow = (weekStart: Date) => {
    const weekNumber = getWeek(weekStart, { weekStartsOn: 1 });
    const isSelected = isSameWeek(weekStart, selectedWeek, { weekStartsOn: 1 });
    
    const days = Array.from({ length: 7 }, (_, i) => addWeeks(weekStart, 0).getTime() + i * 24 * 60 * 60 * 1000).map(time => new Date(time));
    days.forEach((day, i) => {
      day.setDate(weekStart.getDate() + i);
    });

    return (
      <div key={weekStart.toISOString()} className="flex items-center">
        {/* Week number */}
        <div className={cn(
          "w-12 h-9 flex items-center justify-center text-sm font-medium rounded-l-md",
          isSelected ? "bg-black text-white" : "bg-gray-100 text-gray-600"
        )}>
          {weekNumber}
        </div>
        
        {/* Week days */}
        <button
          onClick={() => handleWeekSelect(weekStart)}
          className={cn(
            "flex-1 flex items-center h-9 rounded-r-md border transition-colors",
            isSelected 
              ? "bg-blue-500 text-white border-blue-500" 
              : "bg-white hover:bg-blue-50 border-gray-200 hover:border-blue-300"
          )}
        >
          {days.map((day, dayIndex) => (
            <div
              key={dayIndex}
              className={cn(
                "flex-1 text-center text-sm py-1",
                dayIndex === 0 && "pl-2",
                dayIndex === 6 && "pr-2"
              )}
            >
              {format(day, 'd')}
            </div>
          ))}
        </button>
      </div>
    );
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePreviousWeek}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="h-8 px-3 text-sm font-medium min-w-[160px] justify-start"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {weekLabel}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="p-4">
              {/* Month navigation */}
              <div className="flex items-center justify-between mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePreviousMonth}
                  className="h-8 w-8 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <h3 className="text-sm font-medium">
                  {format(currentMonth, 'MMMM yyyy')}
                </h3>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleNextMonth}
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Days of week header */}
              <div className="flex items-center mb-2">
                <div className="w-12 text-xs text-gray-500 text-center">Wk</div>
                <div className="flex-1 flex">
                  {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(day => (
                    <div key={day} className="flex-1 text-xs text-gray-500 text-center py-1">
                      {day}
                    </div>
                  ))}
                </div>
              </div>

              {/* Week rows */}
              <div className="space-y-1">
                {weeks.map(renderWeekRow)}
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleNextWeek}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
