
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

  // Period options with clearer labels
  const periodOptions = [
    { value: '1', label: '1 Week' },
    { value: '2', label: '2 Weeks' },
    { value: '4', label: '1 Month' },
    { value: '8', label: '2 Months' },
    { value: '12', label: '3 Months' }
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-center bg-white p-6 rounded-lg shadow-sm border">
      {/* Left section: Month selector with navigation */}
      <div className="flex border rounded-lg p-2 items-center shadow-sm bg-gray-50/50">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handlePreviousMonth} 
          className="h-8 w-8 p-0 hover:bg-white"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous month</span>
        </Button>
        
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-4 hover:bg-white">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium min-w-[120px] text-left">{monthLabel}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                if (date) {
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
          className="h-8 w-8 p-0 hover:bg-white"
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next month</span>
        </Button>
      </div>
      
      {/* Middle section: Period selector with improved spacing */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground font-medium">View:</span>
        <Select 
          value={periodToShow.toString()}
          onValueChange={(value) => onPeriodChange(parseInt(value, 10))}
        >
          <SelectTrigger className="w-[160px] bg-white border-gray-200 shadow-sm">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 shadow-lg">
            {periodOptions.map((option) => (
              <SelectItem 
                key={option.value} 
                value={option.value}
                className="hover:bg-gray-50 focus:bg-gray-50"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Right section: Filter controls */}
      <div className="flex items-center gap-3 ml-auto">
        <Popover open={filtersOpen} onOpenChange={setFiltersOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center gap-2 bg-white border-gray-200 shadow-sm hover:bg-gray-50"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1 bg-brand-violet/10 text-brand-violet border-0">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 bg-white border border-gray-200 shadow-lg" align="end">
            {filterContent}
          </PopoverContent>
        </Popover>
        
        {/* Clear filters button */}
        {activeFiltersCount > 0 && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onClearFilters}
            className="text-muted-foreground hover:text-foreground hover:bg-gray-50"
          >
            Clear all
          </Button>
        )}
      </div>
    </div>
  );
};
