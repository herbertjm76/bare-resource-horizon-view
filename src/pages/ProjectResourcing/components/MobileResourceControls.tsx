import React, { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { Button } from '@/components/ui/button';
import { Calendar, ChevronLeft, ChevronRight, Filter, Expand, Shrink, Download, ArrowUpDown, Settings } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProjectResourcingFilters } from './ProjectResourcingFilters';

interface MobileResourceControlsProps {
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
}

export const MobileResourceControls: React.FC<MobileResourceControlsProps> = ({
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
  onExport
}) => {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handlePreviousMonth = () => {
    onDateChange(subMonths(selectedDate, 1));
  };

  const handleNextMonth = () => {
    onDateChange(addMonths(selectedDate, 1));
  };

  // Swipe handlers for month navigation
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleNextMonth(),
    onSwipedRight: () => handlePreviousMonth(),
    preventScrollOnSwipe: false,
    trackMouse: false,
    delta: 50
  });

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

  return (
    <div className="lg:hidden">
      {/* Compact Header with Month Navigation - No Period Selector */}
      <div {...swipeHandlers} className="bg-card rounded-lg border p-2 mb-2 touch-pan-y">
        <div className="flex items-center justify-between gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handlePreviousMonth}
            className="h-9 w-9 p-0 bg-muted hover:bg-gradient-modern hover:text-white hover:border-transparent transition-all active:scale-95"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center gap-2 flex-1 justify-center">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="font-medium text-sm">{monthLabel}</span>
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleNextMonth}
            className="h-9 w-9 p-0 bg-muted hover:bg-gradient-modern hover:text-white hover:border-transparent transition-all active:scale-95"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Compact Actions Row - No Expand/Export buttons */}
      <div className="bg-card rounded-lg border p-2 mb-2">
        <div className="flex items-center gap-2">
          {/* Sort Controls */}
          <Select 
            value={sortBy}
            onValueChange={onSortChange}
          >
            <SelectTrigger className="h-8 flex-1 text-xs bg-muted border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={onSortDirectionToggle}
            className="h-8 w-8 p-0 bg-muted hover:bg-gradient-modern hover:text-white hover:border-transparent transition-all active:scale-95"
            title={sortDirection === 'asc' ? 'Ascending' : 'Descending'}
          >
            <ArrowUpDown className={`h-3.5 w-3.5 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
          </Button>

          <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 bg-muted hover:bg-gradient-modern hover:text-white hover:border-transparent transition-all active:scale-95 relative"
              >
                <Filter className="h-3.5 w-3.5" />
                {activeFiltersCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-[9px]">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh] overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Filters & Display Options</SheetTitle>
              </SheetHeader>
              <div className="mt-4">
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
                {activeFiltersCount > 0 && (
                  <Button 
                    variant="outline" 
                    className="w-full mt-4"
                    onClick={() => {
                      onClearFilters();
                      setFiltersOpen(false);
                    }}
                  >
                    Clear All Filters
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
};