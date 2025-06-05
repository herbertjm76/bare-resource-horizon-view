
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, Calendar, Filter } from 'lucide-react';
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
    <div className="space-y-3">
      {/* Single row layout - mobile optimized */}
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Week navigation - flex-shrink-0 to prevent compression */}
        <div className="flex items-center border rounded-lg p-1.5 sm:p-2 shadow-sm bg-white flex-shrink-0">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handlePreviousWeek} 
            className="h-7 w-7 p-0 hover:bg-gray-100"
          >
            <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="sr-only">Previous week</span>
          </Button>
          
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-1 px-2 py-1 h-7 hover:bg-gray-100 min-w-0">
                <Calendar className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium truncate max-w-[80px] sm:max-w-none">
                  {format(selectedWeek, 'MMM d')}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={selectedWeek}
                onSelect={(date) => {
                  if (date) {
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
            className="h-7 w-7 p-0 hover:bg-gray-100"
          >
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="sr-only">Next week</span>
          </Button>
        </div>
        
        {/* Filter controls - compact and right-aligned */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <Popover open={filtersOpen} onOpenChange={setFiltersOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-1 h-8 px-2 sm:px-2.5 bg-white border-gray-200 shadow-sm hover:bg-gray-50 text-xs"
              >
                <Filter className="h-3 w-3" />
                <span className="hidden xs:inline">Filters</span>
                {activeFilterCount > 0 && (
                  <Badge variant="secondary" className="h-4 px-1 text-xs bg-brand-violet/10 text-brand-violet border-0">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
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
          
          {/* Clear filters - only show when there are active filters */}
          {activeFilterCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                onFilterChange('office', 'all');
                onFilterChange('searchTerm', '');
              }}
              className="h-8 text-xs text-muted-foreground hover:text-foreground hover:bg-gray-50 px-1.5 sm:px-2"
            >
              Clear
            </Button>
          )}
        </div>
      </div>
      
      {/* Mobile week label - shown below controls on small screens */}
      <div className="sm:hidden">
        <p className="text-sm text-muted-foreground px-1">
          {weekLabel}
        </p>
      </div>
    </div>
  );
};
