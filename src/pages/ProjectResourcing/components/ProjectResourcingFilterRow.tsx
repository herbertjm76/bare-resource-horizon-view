
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ProjectResourcingFilterRowProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  periodToShow: number;
  onPeriodChange: (period: number) => void;
  filterContent: React.ReactNode;
  activeFiltersCount: number;
  onClearFilters: () => void;
}

export const ProjectResourcingFilterRow: React.FC<ProjectResourcingFilterRowProps> = ({
  selectedDate,
  onDateChange,
  periodToShow,
  onPeriodChange,
  filterContent,
  activeFiltersCount,
  onClearFilters
}) => {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  
  const handlePreviousMonth = () => {
    onDateChange(subMonths(selectedDate, 1));
  };

  const handleNextMonth = () => {
    onDateChange(addMonths(selectedDate, 1));
  };

  const monthLabel = format(selectedDate, 'MMMM yyyy');

  // Period options
  const periodOptions = [
    { value: '1', label: '1 Week' },
    { value: '2', label: '2 Weeks' },
    { value: '4', label: '1 Month' },
    { value: '8', label: '2 Months' },
    { value: '12', label: '3 Months' }
  ];

  return (
    <div className="flex flex-wrap gap-4 mb-6 items-center bg-white p-4 rounded-lg shadow-sm border">
      {/* Month selector with navigation */}
      <div className="flex border rounded-md p-2 items-center shadow-sm">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handlePreviousMonth} 
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous month</span>
        </Button>
        
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-1 px-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{monthLabel}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                if (date) {
                  // Ensure we always use the start of the month
                  const startOfSelectedMonth = startOfMonth(date);
                  onDateChange(startOfSelectedMonth);
                  setCalendarOpen(false);
                }
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleNextMonth}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next month</span>
        </Button>
      </div>
      
      {/* Period selector */}
      <Select 
        value={periodToShow.toString()}
        onValueChange={(value) => onPeriodChange(parseInt(value, 10))}
      >
        <SelectTrigger className="w-[140px]">
          <div className="flex items-center">
            <span className="text-xs mr-2 text-muted-foreground">View:</span>
            <SelectValue placeholder="Select period" />
          </div>
        </SelectTrigger>
        <SelectContent>
          {periodOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {/* Filter button */}
      <Popover open={filtersOpen} onOpenChange={setFiltersOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-1 bg-brand-violet/10 text-brand-violet">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end">
          {filterContent}
        </PopoverContent>
      </Popover>
      
      {/* Clear filters button */}
      {activeFiltersCount > 0 && (
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onClearFilters}
          className="text-muted-foreground hover:text-foreground"
        >
          Clear filters
        </Button>
      )}
    </div>
  );
};
