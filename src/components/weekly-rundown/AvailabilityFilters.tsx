import React from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Filter, ArrowUpDown, X } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';

type SortBy = 'hours' | 'name';
type FilterBy = 'all' | 'department' | 'sector';

interface AvailabilityFiltersProps {
  sortBy: SortBy;
  onSortChange: (value: SortBy) => void;
  filterBy: FilterBy;
  onFilterChange: (value: FilterBy) => void;
  selectedDepartment: string;
  onDepartmentChange: (value: string) => void;
  selectedSector: string;
  onSectorChange: (value: string) => void;
  departments: string[];
  sectors: string[];
  activeFilterCount: number;
  onClearFilters: () => void;
}

export const AvailabilityFilters: React.FC<AvailabilityFiltersProps> = ({
  sortBy,
  onSortChange,
  filterBy,
  onFilterChange,
  selectedDepartment,
  onDepartmentChange,
  selectedSector,
  onSectorChange,
  departments,
  sectors,
  activeFilterCount,
  onClearFilters,
}) => {
  return (
    <div className="flex gap-1.5 sm:gap-2 availability-filters-mobile">
      {/* Filter Popover */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="default"
            size="icon"
            className="h-8 w-8 sm:h-9 sm:w-9 relative bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Filter className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            {activeFilterCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-[10px] rounded-full"
              >
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64" align="start">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-sm">Filter Members</h4>
              {activeFilterCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearFilters}
                  className="h-7 text-xs"
                >
                  Clear all
                </Button>
              )}
            </div>
            
            <div className="space-y-3">
              <div className="space-y-2">
                <Label className="text-xs font-medium">Filter by</Label>
                <RadioGroup value={filterBy} onValueChange={(value) => onFilterChange(value as FilterBy)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="filter-all" />
                    <Label htmlFor="filter-all" className="text-sm cursor-pointer">All Members</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="department" id="filter-department" />
                    <Label htmlFor="filter-department" className="text-sm cursor-pointer">Department</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sector" id="filter-sector" />
                    <Label htmlFor="filter-sector" className="text-sm cursor-pointer">Sector</Label>
                  </div>
                </RadioGroup>
              </div>

              {filterBy === 'department' && departments.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-xs font-medium">Select Department</Label>
                  <ScrollArea className="h-32 rounded-md border">
                    <div className="p-2 space-y-2">
                      {departments.map((dept) => (
                        <div key={dept} className="flex items-center space-x-2">
                          <Checkbox
                            id={`dept-${dept}`}
                            checked={selectedDepartment === dept}
                            onCheckedChange={(checked) => {
                              onDepartmentChange(checked ? dept : '');
                            }}
                          />
                          <Label htmlFor={`dept-${dept}`} className="text-sm cursor-pointer flex-1">
                            {dept}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}

              {filterBy === 'sector' && sectors.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-xs font-medium">Select Sector</Label>
                  <ScrollArea className="h-32 rounded-md border">
                    <div className="p-2 space-y-2">
                      {sectors.map((sector) => (
                        <div key={sector} className="flex items-center space-x-2">
                          <Checkbox
                            id={`sector-${sector}`}
                            checked={selectedSector === sector}
                            onCheckedChange={(checked) => {
                              onSectorChange(checked ? sector : '');
                            }}
                          />
                          <Label htmlFor={`sector-${sector}`} className="text-sm cursor-pointer flex-1">
                            {sector}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Sort Popover */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="default"
            size="icon"
            className="h-8 w-8 sm:h-9 sm:w-9 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <ArrowUpDown className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56" align="start">
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Sort Members</h4>
            <RadioGroup value={sortBy} onValueChange={(value) => onSortChange(value as SortBy)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="hours" id="sort-hours" />
                <Label htmlFor="sort-hours" className="text-sm cursor-pointer">By Available Hours</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="name" id="sort-name" />
                <Label htmlFor="sort-name" className="text-sm cursor-pointer">By Name</Label>
              </div>
            </RadioGroup>
          </div>
        </PopoverContent>
      </Popover>

      {/* Active Filter Pills */}
      {activeFilterCount > 0 && (
        <div className="flex items-center gap-1 ml-1 sm:ml-2">
          {selectedDepartment && (
            <Badge variant="secondary" className="text-[10px] sm:text-xs h-6 sm:h-7 gap-1 px-1.5 sm:px-2">
              {selectedDepartment}
              <X 
                className="h-3 w-3 cursor-pointer hover:text-destructive" 
                onClick={() => onDepartmentChange('')}
              />
            </Badge>
          )}
          {selectedSector && (
            <Badge variant="secondary" className="text-[10px] sm:text-xs h-6 sm:h-7 gap-1 px-1.5 sm:px-2">
              {selectedSector}
              <X 
                className="h-3 w-3 cursor-pointer hover:text-destructive" 
                onClick={() => onSectorChange('')}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};
