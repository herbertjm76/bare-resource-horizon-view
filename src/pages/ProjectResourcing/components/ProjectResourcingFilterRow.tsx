
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Filter, MoreVertical, Expand, Minimize } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { AdvancedFilters } from '@/components/resources/filters/AdvancedFilters';
import { SearchInput } from '@/components/resources/filters/SearchInput';
import { DisplayOptionsDropdown } from '@/components/resources/filters/DisplayOptionsDropdown';
import { ViewSelector, ViewOption } from '@/components/resources/filters/ViewSelector';
import { PeriodSelector } from '@/components/resources/filters/PeriodSelector';
import { MonthYearSelector } from '@/components/resources/filters/MonthYearSelector';

interface ProjectResourcingFilterRowProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  periodToShow: number;
  onPeriodChange: (period: number) => void;
  filters: {
    office: string;
    country: string;
    manager: string;
  };
  searchTerm: string;
  onFilterChange: (key: string, value: string) => void;
  onSearchChange: (value: string) => void;
  officeOptions: string[];
  countryOptions: string[];
  managers: Array<{ id: string; name: string }>;
  activeFiltersCount: number;
  displayOptions: {
    showWeekends: boolean;
    selectedDays: string[];
    weekStartsOnSunday: boolean;
  };
  onDisplayOptionChange: (key: string, value: any) => void;
  onClearFilters: () => void;
  onExpandAll: () => void;
  onCollapseAll: () => void;
  expandedProjects: string[];
  totalProjects: number;
  selectedView?: ViewOption;
  onViewChange?: (view: ViewOption) => void;
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
  totalProjects,
  selectedView = '3-months',
  onViewChange
}) => {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [displayOptionsOpen, setDisplayOptionsOpen] = useState(false);

  const allExpanded = expandedProjects.includes('all') || expandedProjects.length === totalProjects;

  return (
    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between bg-white p-4 rounded-lg border">
      {/* Left side - Search, Filters, and View Selector */}
      <div className="flex flex-1 items-center gap-3 w-full lg:w-auto flex-wrap">
        <SearchInput
          value={searchTerm}
          onChange={onSearchChange}
          placeholder="Search projects..."
          className="w-full sm:w-80 flex-shrink-0"
        />
        
        <Popover open={filtersOpen} onOpenChange={setFiltersOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 flex-shrink-0">
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filters</span>
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="start">
            <AdvancedFilters
              filters={filters}
              onFilterChange={onFilterChange}
              officeOptions={officeOptions}
              countryOptions={countryOptions}
              managerOptions={managers}
              onClose={() => setFiltersOpen(false)}
              show={true}
            />
          </PopoverContent>
        </Popover>

        {activeFiltersCount > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearFilters}
            className="text-muted-foreground hover:text-foreground flex-shrink-0"
          >
            Clear ({activeFiltersCount})
          </Button>
        )}

        {/* View Selector */}
        {onViewChange && (
          <ViewSelector
            selectedView={selectedView}
            onViewChange={onViewChange}
          />
        )}
      </div>

      {/* Right side - Controls */}
      <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
        {/* Month/Year Selector - only show if no view selector */}
        {!onViewChange && (
          <div className="flex items-center gap-2">
            <MonthYearSelector
              selectedDate={selectedDate}
              onDateChange={onDateChange}
            />
            <PeriodSelector
              periodToShow={periodToShow}
              onPeriodChange={onPeriodChange}
            />
          </div>
        )}
        
        {/* Expand/Collapse Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={allExpanded ? onCollapseAll : onExpandAll}
            className="gap-2 flex-shrink-0"
          >
            {allExpanded ? (
              <>
                <Minimize className="h-4 w-4" />
                <span className="hidden sm:inline">Collapse All</span>
              </>
            ) : (
              <>
                <Expand className="h-4 w-4" />
                <span className="hidden sm:inline">Expand All</span>
              </>
            )}
          </Button>
        </div>

        {/* Display Options */}
        <Popover open={displayOptionsOpen} onOpenChange={setDisplayOptionsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 flex-shrink-0">
              <MoreVertical className="h-4 w-4" />
              <span className="hidden sm:inline">Display</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <DisplayOptionsDropdown
              displayOptions={displayOptions}
              onDisplayOptionChange={onDisplayOptionChange}
              onClose={() => setDisplayOptionsOpen(false)}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
