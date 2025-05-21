
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { addWeeks, subWeeks, format, startOfWeek, addDays } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { FilterButton } from '@/components/resources/filters/FilterButton';
import { AdvancedFilters } from '@/components/resources/filters/AdvancedFilters';

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
  const [filtersOpen, setFiltersOpen] = useState(false);
  
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

  // Mock options for filters
  const officeOptions = ['London', 'New York', 'Singapore', 'Tokyo', 'Paris'];
  const countryOptions = ['UK', 'USA', 'Singapore', 'Japan', 'France'];
  const managerOptions = [
    { id: '1', name: 'John Smith' },
    { id: '2', name: 'Jane Doe' },
    { id: '3', name: 'Alex Johnson' }
  ];

  return (
    <div className="flex flex-wrap gap-4 mb-4 items-center">
      {/* Week selector with dropdown */}
      <div className="flex border rounded-md p-2 items-center shadow-sm">
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
      
      {/* Filter button moved next to the week selector */}
      <Popover open={filtersOpen} onOpenChange={setFiltersOpen}>
        <PopoverTrigger asChild>
          <div>
            <FilterButton 
              activeFiltersCount={activeFilterCount} 
              onClick={() => setFiltersOpen(!filtersOpen)}
            />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end">
          <AdvancedFilters
            filters={{
              office: filters.office,
              country: 'all',
              manager: 'all',
            }}
            onFilterChange={onFilterChange}
            officeOptions={officeOptions}
            countryOptions={countryOptions}
            managerOptions={managerOptions}
            onClose={() => setFiltersOpen(false)}
            show={true}
          />
        </PopoverContent>
      </Popover>
      
      {/* Spacer to push other elements to the right if needed */}
      <div className="flex-grow"></div>
    </div>
  );
};
