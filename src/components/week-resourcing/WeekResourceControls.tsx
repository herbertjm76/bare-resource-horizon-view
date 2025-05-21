
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, Calendar, Filter, Search } from 'lucide-react';
import { addWeeks, subWeeks, format, startOfWeek, addDays } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';

interface WeekResourceControlsProps {
  selectedWeek: Date;
  setSelectedWeek: (date: Date) => void;
  weekLabel: string;
  filters: {
    office: string;
    searchTerm: string;
  };
  onFilterChange: (key: string, value: string) => void;
}

export const WeekResourceControls: React.FC<WeekResourceControlsProps> = ({
  selectedWeek,
  setSelectedWeek,
  weekLabel,
  filters,
  onFilterChange
}) => {
  const [calendarOpen, setCalendarOpen] = useState(false);
  
  const handlePreviousWeek = () => {
    setSelectedWeek(subWeeks(selectedWeek, 1));
  };

  const handleNextWeek = () => {
    setSelectedWeek(addWeeks(selectedWeek, 1));
  };

  // Generate a list of weeks (8 previous, current, 8 next)
  const weekOptions = Array.from({ length: 17 }, (_, i) => {
    const weekDate = subWeeks(selectedWeek, 8 - i);
    const mondayOfWeek = startOfWeek(weekDate, { weekStartsOn: 1 });
    const sundayOfWeek = addDays(mondayOfWeek, 6);
    const label = `${format(mondayOfWeek, 'MMM d')} - ${format(sundayOfWeek, 'MMM d, yyyy')}`;
    
    return {
      value: mondayOfWeek.toISOString(),
      label: label,
      isCurrent: i === 8
    };
  });

  // Count active filters
  const activeFilterCount = Object.values(filters).filter(val => 
    val !== '' && val !== 'all'
  ).length;

  return (
    <div className="flex flex-wrap gap-4 mb-4 items-center">
      {/* Week selector with dropdown */}
      <div className="flex border rounded-md p-2 items-center shadow-sm mr-auto">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handlePreviousWeek} 
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous week</span>
        </Button>
        
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-1 px-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{weekLabel}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="single"
              selected={selectedWeek}
              onSelect={(date) => {
                if (date) {
                  // Ensure we always use Monday of the selected week
                  const mondayOfWeek = startOfWeek(date, { weekStartsOn: 1 });
                  setSelectedWeek(mondayOfWeek);
                  setCalendarOpen(false);
                }
              }}
              initialFocus
            />
            <div className="border-t p-3">
              <Select 
                value={selectedWeek.toISOString()}
                onValueChange={(value) => {
                  setSelectedWeek(new Date(value));
                  setCalendarOpen(false);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select week" />
                </SelectTrigger>
                <SelectContent>
                  {weekOptions.map((option) => (
                    <SelectItem 
                      key={option.value} 
                      value={option.value}
                      className={option.isCurrent ? "font-bold" : ""}
                    >
                      {option.label}
                      {option.isCurrent && (
                        <Badge className="ml-2 bg-brand-primary text-white">Current</Badge>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </PopoverContent>
        </Popover>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleNextWeek}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next week</span>
        </Button>
      </div>
      
      {/* Office filter */}
      <div>
        <Select 
          value={filters.office} 
          onValueChange={(value) => onFilterChange('office', value)}
        >
          <SelectTrigger className="h-10 min-w-[160px]">
            <SelectValue placeholder="All Offices" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Offices</SelectItem>
            <SelectItem value="london">London</SelectItem>
            <SelectItem value="new_york">New York</SelectItem>
            <SelectItem value="singapore">Singapore</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Filter button */}
      {activeFilterCount > 0 ? (
        <Button variant="default" className="h-10 gap-2">
          <Filter className="h-4 w-4" />
          <span>Filters</span>
          <Badge variant="secondary" className="ml-1 bg-white text-primary">
            {activeFilterCount}
          </Badge>
        </Button>
      ) : (
        <Button variant="outline" className="h-10 gap-2">
          <Filter className="h-4 w-4" />
          <span>Filters</span>
        </Button>
      )}
    </div>
  );
};
