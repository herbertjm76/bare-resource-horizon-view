
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, ChevronLeft, ChevronRight, Filter, Expand, Shrink } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProjectResourcingFilters } from './ProjectResourcingFilters';

interface ProjectResourcingFilterRowProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  periodToShow: number;
  onPeriodChange: (period: number) => void;
  filters: {
    office: string;
    country: string;
    manager: string;
    status: string;
    periodToShow: number;
  };
  searchTerm: string;
  onFilterChange: (key: string, value: string) => void;
  onSearchChange: (value: string) => void;
  officeOptions: string[];
  countryOptions: string[];
  managers: Array<{id: string, name: string}>;
  activeFiltersCount: number;
  displayOptions: {
    showWeekends: boolean;
    selectedDays: string[];
    weekStartsOnSunday: boolean;
  };
  onDisplayOptionChange: (option: string, value: boolean | string[]) => void;
  onClearFilters: () => void;
  onExpandAll: () => void;
  onCollapseAll: () => void;
  expandedProjects: string[];
  totalProjects: number;
}

export const ProjectResourcingFilterRow: React.FC<ProjectResourcingFilterRowProps> = ({
  selectedDate,
  onDateChange,
  periodToShow,
  onPeriodChange,
  filters,
  searchTerm,
  onFilterChange,
  onSearchChange,
  officeOptions,
  countryOptions,
  managers,
  activeFiltersCount,
  displayOptions,
  onDisplayOptionChange,
  onClearFilters,
  onExpandAll,
  onCollapseAll,
  expandedProjects,
  totalProjects
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

  // Updated period options to include 1 week, 1, 2, and 3 months
  const periodOptions = [
    { value: '1', label: '1 Week' },
    { value: '4', label: '1 Month' },
    { value: '8', label: '2 Months' },
    { value: '12', label: '3 Months' }
  ];

  // Determine if all projects are expanded
  const allExpanded = expandedProjects.length === totalProjects && totalProjects > 0;
  
  // Handle toggle between expand all and collapse all
  const handleToggleExpand = () => {
    if (allExpanded) {
      onCollapseAll();
    } else {
      onExpandAll();
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-4">
      {/* Left section: Month selector with navigation */}
      <div className="flex border rounded-lg p-2 items-center shadow-sm bg-gray-50/50">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handlePreviousMonth} 
          className="h-7 w-7 p-0 hover:bg-white"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous month</span>
        </Button>
        
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-3 py-1 h-7 hover:bg-white">
              <Calendar className="h-3 w-3 text-muted-foreground" />
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
          className="h-7 w-7 p-0 hover:bg-white"
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next month</span>
        </Button>
      </div>
      
      {/* Middle section: Period selector with compact design */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground font-medium">View:</span>
        <Select 
          value={periodToShow.toString()}
          onValueChange={(value) => onPeriodChange(parseInt(value, 10))}
        >
          <SelectTrigger className="w-[140px] h-8 bg-white border-gray-200 shadow-sm text-sm">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 shadow-lg min-w-[140px]">
            {periodOptions.map((option) => (
              <SelectItem 
                key={option.value} 
                value={option.value}
                className="hover:bg-gray-50 focus:bg-gray-50 py-1.5 text-sm"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Expand/Collapse toggle button */}
      <div className="flex items-center">
        <Button
          variant="outline"
          size="sm"
          onClick={handleToggleExpand}
          className="h-8 text-sm"
          disabled={totalProjects === 0}
        >
          {allExpanded ? (
            <>
              <Shrink className="h-3 w-3 mr-2" />
              Collapse All
            </>
          ) : (
            <>
              <Expand className="h-3 w-3 mr-2" />
              Expand All
            </>
          )}
        </Button>
      </div>
      
      {/* Filter controls */}
      <div className="flex items-center gap-3">
        <Popover open={filtersOpen} onOpenChange={setFiltersOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center gap-2 h-8 bg-white border-gray-200 shadow-sm hover:bg-gray-50 text-sm"
            >
              <Filter className="h-3 w-3" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1 h-4 px-1 text-xs bg-theme-primary/10 text-theme-primary border-0">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 bg-white border border-gray-200 shadow-lg" align="end">
            <ProjectResourcingFilters
              filters={filters}
              searchTerm={searchTerm}
              onFilterChange={onFilterChange}
              onPeriodChange={onPeriodChange}
              onSearchChange={onSearchChange}
              officeOptions={officeOptions}
              countryOptions={countryOptions}
              managers={managers}
              activeFiltersCount={activeFiltersCount}
              displayOptions={displayOptions}
              onDisplayOptionChange={onDisplayOptionChange}
            />
          </PopoverContent>
        </Popover>
        
        {/* Clear filters button */}
        {activeFiltersCount > 0 && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onClearFilters}
            className="h-8 text-sm text-muted-foreground hover:text-foreground hover:bg-gray-50"
          >
            Clear all
          </Button>
        )}
      </div>
    </div>
  );
};
