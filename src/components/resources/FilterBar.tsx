
import React, { useState } from 'react';
import { Filter, Check, ChevronDown, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DateRangePicker, DateRange } from "@/components/ui/date-range-picker";
import { cn } from "@/lib/utils";
import { addDays, format } from 'date-fns';

interface FilterBarProps {
  filters: {
    office: string;
    country: string;
    manager: string;
  };
  onFilterChange: (key: string, value: string) => void;
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  weeksToShow: number;
  onWeeksChange: (weeks: number) => void;
  officeOptions: string[];
  countryOptions: string[];
  managerOptions: {id: string, name: string}[];
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  dateRange,
  onDateRangeChange,
  weeksToShow,
  onWeeksChange,
  officeOptions,
  countryOptions,
  managerOptions
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Count active filters
  const activeFiltersCount = 
    (filters.office !== 'all' ? 1 : 0) + 
    (filters.country !== 'all' ? 1 : 0) + 
    (filters.manager !== 'all' ? 1 : 0);

  const clearFilters = () => {
    onFilterChange('office', 'all');
    onFilterChange('country', 'all');
    onFilterChange('manager', 'all');
  };

  return (
    <div className="flex flex-wrap items-center gap-3 p-4 bg-white border rounded-lg shadow-sm">
      <div className="flex-1 space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Week Start Picker */}
          <Button 
            variant="outline"
            className="min-w-[200px] justify-start text-left border-slate-200 bg-white hover:bg-slate-100"
            onClick={() => {
              // Handle week selection - this could be enhanced with a specific week picker
              const newStartDate = dateRange.from;
              onDateRangeChange({
                from: newStartDate,
                to: addDays(newStartDate, (weeksToShow * 7) - 1)
              });
            }}
          >
            <div className="flex items-center">
              <span className="text-brand-primary mr-2">Starting:</span>
              <span>{format(dateRange.from, 'MMM dd, yyyy')}</span>
            </div>
          </Button>

          {/* Weeks to Show */}
          <Select 
            value={weeksToShow.toString()}
            onValueChange={(value) => onWeeksChange(parseInt(value, 10))}
          >
            <SelectTrigger 
              className="w-[140px] bg-white border-slate-200"
            >
              <div className="flex items-center">
                <span className="text-xs mr-2 text-muted-foreground">View:</span>
                <SelectValue placeholder="Weeks to show" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="8">8 Weeks</SelectItem>
              <SelectItem value="12">12 Weeks</SelectItem>
              <SelectItem value="16">16 Weeks</SelectItem>
              <SelectItem value="26">26 Weeks</SelectItem>
              <SelectItem value="52">52 Weeks</SelectItem>
            </SelectContent>
          </Select>

          {/* Advanced Filters Button */}
          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="flex items-center border-slate-200 bg-white hover:bg-slate-100"
              >
                <Filter className="w-4 h-4 mr-2 text-brand-primary" />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <Badge 
                    className="ml-2 bg-brand-primary hover:bg-brand-primary" 
                    variant="secondary"
                  >
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-0" align="start" side="bottom">
              <div className="px-4 pt-4 pb-2 flex items-center justify-between">
                <h3 className="font-medium">Advanced Filters</h3>
                {activeFiltersCount > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-xs h-7 px-2"
                    onClick={clearFilters}
                  >
                    <X className="w-3 h-3 mr-1" />
                    Clear all filters
                  </Button>
                )}
              </div>
              <Separator />
              
              <div className="p-4 grid gap-4">
                {/* Office Filter */}
                <div className="grid gap-1.5">
                  <label className="text-xs font-medium">Office</label>
                  <Select 
                    value={filters.office}
                    onValueChange={(value) => onFilterChange('office', value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All Offices" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Offices</SelectItem>
                      {officeOptions.map((office) => (
                        <SelectItem key={office} value={office}>
                          {office}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Country Filter */}
                <div className="grid gap-1.5">
                  <label className="text-xs font-medium">Country</label>
                  <Select 
                    value={filters.country}
                    onValueChange={(value) => onFilterChange('country', value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All Countries" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Countries</SelectItem>
                      {countryOptions.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Manager Filter */}
                <div className="grid gap-1.5">
                  <label className="text-xs font-medium">Project Manager</label>
                  <Select 
                    value={filters.manager}
                    onValueChange={(value) => onFilterChange('manager', value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All Project Managers" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Project Managers</SelectItem>
                      {managerOptions.map((manager) => (
                        <SelectItem key={manager.id} value={manager.id}>
                          {manager.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Active filters display */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2">
            {filters.office !== 'all' && (
              <Badge 
                variant="outline" 
                className="bg-slate-50 hover:bg-slate-100 text-xs py-0 h-6"
              >
                Office: {filters.office}
                <button 
                  className="ml-1 hover:text-destructive"
                  onClick={() => onFilterChange('office', 'all')}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filters.country !== 'all' && (
              <Badge 
                variant="outline" 
                className="bg-slate-50 hover:bg-slate-100 text-xs py-0 h-6"
              >
                Country: {filters.country}
                <button 
                  className="ml-1 hover:text-destructive"
                  onClick={() => onFilterChange('country', 'all')}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filters.manager !== 'all' && (
              <Badge 
                variant="outline" 
                className="bg-slate-50 hover:bg-slate-100 text-xs py-0 h-6"
              >
                Manager: {managerOptions.find(m => m.id === filters.manager)?.name || filters.manager}
                <button 
                  className="ml-1 hover:text-destructive"
                  onClick={() => onFilterChange('manager', 'all')}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
