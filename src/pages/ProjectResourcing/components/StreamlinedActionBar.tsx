import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, ChevronLeft, ChevronRight, Filter, Expand, Shrink, Download, ArrowUpDown } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProjectResourcingFilters } from './ProjectResourcingFilters';
import { MobileResourceControls } from './MobileResourceControls';
import { SavedPresetsDropdown } from '@/components/filters/SavedPresetsDropdown';
import { ViewType } from '@/hooks/useViewPresets';

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
  onExport?: () => void;
  // Presets support
  viewType?: ViewType;
  onApplyPreset?: (filters: Record<string, any>) => void;
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
  totalProjects,
  onExport,
  viewType = 'resource_scheduling',
  onApplyPreset
}) => {
  const [calendarOpen, setCalendarOpen] = useState(false);
  
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
    <>
      {/* Mobile Controls */}
      <MobileResourceControls
        selectedDate={selectedDate}
        onDateChange={onDateChange}
        periodToShow={periodToShow}
        onPeriodChange={onPeriodChange}
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSortChange={onSortChange}
        onSortDirectionToggle={onSortDirectionToggle}
        filters={filters}
        searchTerm={searchTerm}
        onFilterChange={onFilterChange}
        onSearchChange={onSearchChange}
        officeOptions={officeOptions}
        countryOptions={countryOptions}
        managers={managers}
        activeFiltersCount={activeFiltersCount}
        displayOptions={displayOptions}
        onDisplayOptionChange={onDisplayOptionChange}
        onClearFilters={onClearFilters}
        onExpandAll={onExpandAll}
        onCollapseAll={onCollapseAll}
        expandedProjects={expandedProjects}
        totalProjects={totalProjects}
        onExport={onExport}
      />
      
      {/* Desktop layout */}
      <div className="hidden lg:block px-2 pt-2">
        <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
        {/* Left section - Date Navigation */}
        <div className="flex gap-3 items-center">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground hidden sm:block" />
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handlePreviousMonth}
              className="h-7 w-7 p-0 bg-muted hover:bg-gradient-modern hover:text-white hover:border-transparent transition-all"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-7 min-w-[90px] bg-muted hover:bg-gradient-modern hover:text-white hover:border-transparent transition-all">
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
              className="h-7 w-7 p-0 bg-muted hover:bg-gradient-modern hover:text-white hover:border-transparent transition-all"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Right section - Controls */}
        <div className="flex gap-2 items-center ml-auto overflow-x-auto">
          {/* Period selector */}
          <Select 
            value={periodToShow.toString()}
            onValueChange={(value) => onPeriodChange(parseInt(value, 10))}
          >
            <SelectTrigger className="w-28 h-7 text-xs bg-muted border">
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
            <SelectTrigger className="w-32 h-7 text-xs bg-muted border">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort direction toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={onSortDirectionToggle}
            className="h-7 px-2 bg-muted hover:bg-gradient-modern hover:text-white hover:border-transparent transition-all"
            title={sortDirection === 'asc' ? 'Ascending' : 'Descending'}
          >
            <ArrowUpDown className={`h-3.5 w-3.5 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
          </Button>

          {/* Saved Presets */}
          {onApplyPreset && (
            <SavedPresetsDropdown
              viewType={viewType}
              currentFilters={{ ...filters, searchTerm }}
              onApplyPreset={onApplyPreset}
            />
          )}

          {/* Expand/Collapse */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleExpand}
            className="h-7 px-2 bg-muted hover:bg-gradient-modern hover:text-white hover:border-transparent transition-all"
            disabled={totalProjects === 0}
          >
            {allExpanded ? (
              <Shrink className="h-3.5 w-3.5" />
            ) : (
              <Expand className="h-3.5 w-3.5" />
            )}
          </Button>

          {/* Filters */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-7 px-2 bg-muted hover:bg-gradient-modern hover:text-white hover:border-transparent transition-all">
                <Filter className="h-3.5 w-3.5 mr-1.5" />
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-1 h-4 px-1 text-[10px]">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent 
              className="w-80 pointer-events-auto z-50" 
              align="end"
              onClick={(e) => e.stopPropagation()}
            >
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
              className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              Clear
            </Button>
          )}

          {/* Export */}
          <Button variant="outline" size="sm" className="h-7 px-2 bg-muted hover:bg-gradient-modern hover:text-white hover:border-transparent transition-all" onClick={onExport}>
            <Download className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
    </>
  );
};