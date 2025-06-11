
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Filter, MoreVertical } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { AdvancedFilters } from './filters/AdvancedFilters';
import { SearchInput } from './filters/SearchInput';
import { DisplayOptionsDropdown } from './filters/DisplayOptionsDropdown';
import { ViewSelector, ViewOption } from './filters/ViewSelector';

interface ResourcesToolbarProps {
  filters: {
    office: string;
    country: string;
    manager: string;
  };
  searchTerm: string;
  displayOptions: {
    showWeekends: boolean;
    selectedDays: string[];
    weekStartsOnSunday: boolean;
  };
  selectedView: ViewOption;
  onFilterChange: (key: string, value: string) => void;
  onDisplayOptionChange: (key: string, value: any) => void;
  onViewChange: (view: ViewOption) => void;
  activeFiltersCount: number;
  onClearFilters: () => void;
}

export const ResourcesToolbar: React.FC<ResourcesToolbarProps> = ({
  filters,
  searchTerm,
  displayOptions,
  selectedView,
  onFilterChange,
  onDisplayOptionChange,
  onViewChange,
  activeFiltersCount,
  onClearFilters
}) => {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [displayOptionsOpen, setDisplayOptionsOpen] = useState(false);

  // Mock data for filters
  const officeOptions = ['London', 'New York', 'Singapore', 'Tokyo', 'Paris'];
  const countryOptions = ['UK', 'USA', 'Singapore', 'Japan', 'France'];
  const managerOptions = [
    { id: '1', name: 'John Smith' },
    { id: '2', name: 'Jane Doe' },
    { id: '3', name: 'Alex Johnson' }
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white p-4 rounded-lg border">
      {/* Left side - Search and Filters */}
      <div className="flex flex-1 items-center gap-3 w-full sm:w-auto">
        <SearchInput
          value={searchTerm}
          onChange={(value) => onFilterChange('searchTerm', value)}
          placeholder="Search projects..."
          className="w-full sm:w-80"
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
              managerOptions={managerOptions}
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
            className="text-muted-foreground hover:text-foreground"
          >
            Clear ({activeFiltersCount})
          </Button>
        )}
      </div>

      {/* Right side - View and Display Options */}
      <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
        <ViewSelector
          selectedView={selectedView}
          onViewChange={onViewChange}
        />
        
        <Popover open={displayOptionsOpen} onOpenChange={setDisplayOptionsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
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
