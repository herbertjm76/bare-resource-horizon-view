import React, { useState } from 'react';
import { FilterButton } from '@/components/resources/filters/FilterButton';
import { Button } from '@/components/ui/button';
import { Users, Building, X, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FilterPopover } from '@/components/filters/FilterPopover';
import { PeriodSelector } from '@/components/resources/filters/PeriodSelector';
import { Separator } from '@/components/ui/separator';
import { TeamMember } from '@/components/dashboard/types';

type FilterType = 'all' | 'department' | 'location';

interface TeamAnnualLeaveFiltersProps {
  departments: string[];
  locations: string[];
  activeFilter: FilterType;
  filterValue: string;
  searchQuery: string;
  setActiveFilter: (filter: FilterType) => void;
  setFilterValue: (value: string) => void;
  setSearchQuery: (query: string) => void;
  clearFilters: () => void;
  periodToShow?: number;
  onPeriodChange?: (period: number) => void;
}

export const TeamAnnualLeaveFilters: React.FC<TeamAnnualLeaveFiltersProps> = ({
  departments,
  locations,
  activeFilter,
  filterValue,
  searchQuery,
  setActiveFilter,
  setFilterValue,
  setSearchQuery,
  clearFilters,
  periodToShow,
  onPeriodChange
}) => {
  const activeFiltersCount = (activeFilter === 'all' ? 0 : 1) + (searchQuery ? 1 : 0);

  // Handle filter changes
  const handleFilterTypeChange = (type: FilterType) => {
    if (type === activeFilter) {
      setActiveFilter('all');
      setFilterValue('');
    } else {
      setActiveFilter(type);
      setFilterValue(''); // Reset filter value when changing type
    }
  };

  // Render filter content for the popover
  const renderFilterContent = () => {
    return (
      <>
        <div className="space-y-4">
          {onPeriodChange && periodToShow !== undefined && (
            <>
              <PeriodSelector
                selectedPeriod={periodToShow}
                onPeriodChange={onPeriodChange}
              />
              <Separator className="my-2" />
            </>
          )}
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Filter Type</label>
            <div className="flex gap-2">
              <Button
                variant={activeFilter === 'location' ? 'default' : 'outline'}
                size="sm"
                className="h-8 gap-1.5"
                onClick={() => handleFilterTypeChange('location')}
              >
                <Building className="h-3.5 w-3.5" />
                Location
              </Button>
              
              <Button
                variant={activeFilter === 'department' ? 'default' : 'outline'}
                size="sm"
                className="h-8 gap-1.5"
                onClick={() => handleFilterTypeChange('department')}
              >
                <Users className="h-3.5 w-3.5" />
                Department
              </Button>
            </div>
          </div>

          {activeFilter === 'department' && departments.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Department</label>
              <Select 
                value={filterValue} 
                onValueChange={setFilterValue}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments
                    .filter(dept => dept && dept !== "")
                    .map(dept => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {activeFilter === 'location' && locations.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <Select 
                value={filterValue} 
                onValueChange={setFilterValue}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {locations
                    .filter(location => location && location !== "")
                    .map(location => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Search Members</label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name..."
                className="pl-9 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        {/* Active filter badges */}
        {activeFiltersCount > 0 && (
          <div className="mt-4 pt-4 border-t flex flex-wrap gap-2">
            {activeFilter !== 'all' && (
              <div className="inline-flex items-center bg-muted/40 rounded-full text-xs py-1 pl-3 pr-1.5">
                <span className="mr-1">
                  {activeFilter === 'department' ? 'Department: ' : 'Location: '}
                  {filterValue}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-5 w-5 p-0 rounded-full"
                  onClick={() => {
                    setActiveFilter('all');
                    setFilterValue('');
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
            
            {searchQuery && (
              <div className="inline-flex items-center bg-muted/40 rounded-full text-xs py-1 pl-3 pr-1.5">
                <span className="mr-1">Search: {searchQuery}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-5 w-5 p-0 rounded-full"
                  onClick={() => setSearchQuery('')}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        )}
      </>
    );
  };

  return (
    <FilterPopover 
      activeFiltersCount={activeFiltersCount} 
      onClearFilters={clearFilters}
    >
      {renderFilterContent()}
    </FilterPopover>
  );
};
