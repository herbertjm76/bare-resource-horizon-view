import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, ChevronLeft, ChevronRight, Filter, Expand, Shrink, Download, ArrowUpDown } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProjectResourcingFilters } from './ProjectResourcingFilters';

interface StreamlinedActionBarProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  periodToShow: number;
  onPeriodChange: (period: number) => void;
  sortBy: 'name' | 'code' | 'status' | 'created';
  sortDirection: 'asc' | 'desc';
  onSortChange: (value: 'name' | 'code' | 'status' | 'created') => void;
  onSortDirectionToggle: () => void;
  filters: {
    office: string;
    country: string;
    manager: string;
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

export const StreamlinedActionBar: React.FC<StreamlinedActionBarProps> = ({
  selectedDate,
  onDateChange,
  periodToShow,
  onPeriodChange,
  sortBy,
  sortDirection,
  onSortChange,
  onSortDirectionToggle,
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

  const monthLabel = format(selectedDate, 'MMM yyyy');

  const periodOptions = [
    { value: '1', label: '1 Week' },
    { value: '4', label: '1 Month' },
    { value: '8', label: '2 Months' },
    { value: '12', label: '3 Months' },
    { value: '16', label: '4 Months' }
  ];

  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'code', label: 'Code' },
    { value: 'status', label: 'Status' },
    { value: 'created', label: 'Created Date' }
  ];

  const allExpanded = expandedProjects.length === totalProjects && totalProjects > 0;
  
  const handleToggleExpand = () => {
    if (allExpanded) {
      onCollapseAll();
    } else {
      onExpandAll();
    }
  };

  return (
    <div className="bg-muted/30 border border-border rounded-lg p-3">
      <div className="flex flex-wrap items-center gap-3">
        
        {/* Time navigation group */}
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handlePreviousMonth}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 min-w-[90px]">
                <Calendar className="h-3 w-3 mr-2" />
                {monthLabel}
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
            variant="outline" 
            size="sm" 
            onClick={handleNextMonth}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Period selector */}
        <Select 
          value={periodToShow.toString()}
          onValueChange={(value) => onPeriodChange(parseInt(value, 10))}
        >
          <SelectTrigger className="w-[120px] h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {periodOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort selector */}
        <Select 
          value={sortBy}
          onValueChange={onSortChange}
        >
          <SelectTrigger className="w-[140px] h-8">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                Sort: {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort direction toggle */}
        <Button
          variant="outline"
          size="sm"
          onClick={onSortDirectionToggle}
          className="h-8 w-8 p-0"
          title={sortDirection === 'asc' ? 'Ascending' : 'Descending'}
        >
          <ArrowUpDown className={`h-3.5 w-3.5 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
        </Button>

        {/* Divider */}
        <div className="h-6 w-px bg-border" />

        {/* View controls group */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleToggleExpand}
          className="h-8"
          disabled={totalProjects === 0}
        >
          {allExpanded ? (
            <>
              <Shrink className="h-3 w-3 mr-2" />
              Collapse
            </>
          ) : (
            <>
              <Expand className="h-3 w-3 mr-2" />
              Expand
            </>
          )}
        </Button>

        {/* Filter controls */}
        <Popover open={filtersOpen} onOpenChange={setFiltersOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              <Filter className="h-3 w-3 mr-2" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-2 h-4 px-1 text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
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
        
        {activeFiltersCount > 0 && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onClearFilters}
            className="h-8 text-muted-foreground"
          >
            Clear
          </Button>
        )}

        {/* Spacer to push export to the right */}
        <div className="flex-1" />

        {/* Export action */}
        <Button variant="outline" size="sm" className="h-8">
          <Download className="h-3 w-3 mr-2" />
          Export
        </Button>
      </div>
    </div>
  );
};