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
    <div className="bg-muted/30 border border-border rounded-lg p-2 sm:p-3">
      {/* Mobile: Stack into 2 clean rows */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2 sm:gap-3">
        {/* Row 1 on mobile: Navigation + Period + Sort */}
        <div className="flex items-center gap-2 flex-1 sm:flex-initial">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handlePreviousMonth}
            className="h-8 w-8 p-0 shrink-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 min-w-[80px] sm:min-w-[90px] text-xs sm:text-sm shrink-0">
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
            className="h-8 w-8 p-0 shrink-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Period selector */}
          <Select 
            value={periodToShow.toString()}
            onValueChange={(value) => onPeriodChange(parseInt(value, 10))}
          >
            <SelectTrigger className="w-[100px] sm:w-[120px] h-8 text-xs sm:text-sm shrink-0">
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

          {/* Sort selector - hidden on mobile, shown on sm+ */}
          <Select 
            value={sortBy}
            onValueChange={onSortChange}
          >
            <SelectTrigger className="hidden sm:flex w-[140px] h-8">
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

          {/* Sort direction toggle - hidden on mobile */}
          <Button
            variant="outline"
            size="sm"
            onClick={onSortDirectionToggle}
            className="hidden sm:flex h-8 w-8 p-0 shrink-0"
            title={sortDirection === 'asc' ? 'Ascending' : 'Descending'}
          >
            <ArrowUpDown className={`h-3.5 w-3.5 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
          </Button>

          {/* Divider - hidden on mobile */}
          <div className="hidden sm:block h-6 w-px bg-border" />
        </div>

        {/* Row 2 on mobile: Expand + Filters + Export */}
        <div className="flex items-center gap-2 flex-1 sm:flex-initial">
          {/* View controls group */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleExpand}
            className="h-8 text-xs sm:text-sm shrink-0"
            disabled={totalProjects === 0}
          >
            {allExpanded ? (
              <>
                <Shrink className="h-3 w-3 sm:mr-2" />
                <span className="hidden sm:inline">Collapse</span>
              </>
            ) : (
              <>
                <Expand className="h-3 w-3 sm:mr-2" />
                <span className="hidden sm:inline">Expand</span>
              </>
            )}
        </Button>

          {/* Filter controls */}
          <Popover open={filtersOpen} onOpenChange={setFiltersOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 text-xs sm:text-sm shrink-0">
                <Filter className="h-3 w-3 sm:mr-2" />
                <span className="hidden sm:inline">Filters</span>
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-1 sm:ml-2 h-4 px-1 text-[10px] sm:text-xs">
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
              className="h-8 text-xs sm:text-sm text-muted-foreground shrink-0"
            >
              Clear
            </Button>
          )}

          {/* Spacer to push export to the right on desktop */}
          <div className="hidden sm:block flex-1" />

          {/* Export action */}
          <Button variant="outline" size="sm" className="h-8 text-xs sm:text-sm ml-auto sm:ml-0 shrink-0">
            <Download className="h-3 w-3 sm:mr-2" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </div>
    </div>
  );
};