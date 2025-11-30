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
      {/* Month Navigation - Swipeable */}
      <div {...swipeHandlers} className="bg-card rounded-lg border p-3 mb-3 touch-pan-y">
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            size="lg"
            onClick={handlePreviousMonth}
            className="h-11 w-11 p-0 bg-muted hover:bg-gradient-modern hover:text-white hover:border-transparent transition-all active:scale-95"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-2 flex-1 justify-center">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium text-base">{monthLabel}</span>
          </div>
          
          <Button 
            variant="outline" 
            size="lg"
            onClick={handleNextMonth}
            className="h-11 w-11 p-0 bg-muted hover:bg-gradient-modern hover:text-white hover:border-transparent transition-all active:scale-95"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="text-xs text-center text-muted-foreground mt-2">
          Swipe left or right to change month
        </div>
      </div>

      {/* Quick Controls */}
      <div className="bg-card rounded-lg border p-3 mb-3">
        <div className="grid grid-cols-2 gap-2">
          {/* Period Selector */}
          <Select 
            value={periodToShow.toString()}
            onValueChange={(value) => onPeriodChange(parseInt(value, 10))}
          >
            <SelectTrigger className="h-11 text-sm bg-muted border">
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

          {/* Sort Selector */}
          <Select 
            value={sortBy}
            onValueChange={onSortChange}
          >
            <SelectTrigger className="h-11 text-sm bg-muted border">
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
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-card rounded-lg border p-3 mb-3">
        <div className="grid grid-cols-4 gap-2">
          {/* Sort Direction */}
          <Button
            variant="outline"
            size="lg"
            onClick={onSortDirectionToggle}
            className="h-12 flex flex-col items-center justify-center gap-1 bg-muted hover:bg-gradient-modern hover:text-white hover:border-transparent transition-all active:scale-95"
            title={sortDirection === 'asc' ? 'Ascending' : 'Descending'}
          >
            <ArrowUpDown className={`h-4 w-4 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
            <span className="text-[10px]">Sort</span>
          </Button>

          {/* Expand/Collapse */}
          <Button
            variant="outline"
            size="lg"
            onClick={allExpanded ? onCollapseAll : onExpandAll}
            className="h-12 flex flex-col items-center justify-center gap-1 bg-muted hover:bg-gradient-modern hover:text-white hover:border-transparent transition-all active:scale-95"
            disabled={totalProjects === 0}
          >
            {allExpanded ? (
              <>
                <Shrink className="h-4 w-4" />
                <span className="text-[10px]">Collapse</span>
              </>
            ) : (
              <>
                <Expand className="h-4 w-4" />
                <span className="text-[10px]">Expand</span>
              </>
            )}
          </Button>

          {/* Filters */}
          <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="lg"
                className="h-12 flex flex-col items-center justify-center gap-1 bg-muted hover:bg-gradient-modern hover:text-white hover:border-transparent transition-all active:scale-95 relative"
              >
                <Filter className="h-4 w-4" />
                <span className="text-[10px]">Filters</span>
                {activeFiltersCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]">
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

          {/* Export */}
          <Button
            variant="outline"
            size="lg"
            onClick={onExport}
            className="h-12 flex flex-col items-center justify-center gap-1 bg-muted hover:bg-gradient-modern hover:text-white hover:border-transparent transition-all active:scale-95"
          >
            <Download className="h-4 w-4" />
            <span className="text-[10px]">Export</span>
          </Button>
        </div>
      </div>
    </div>
  );
};