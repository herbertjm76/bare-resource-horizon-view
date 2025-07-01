
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, X } from 'lucide-react';
import { WeekStartSelector } from '../WeekStartSelector';

interface WorkloadHeaderControlsProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  filterValue: string;
  setFilterValue: (value: string) => void;
  departments: string[];
  locations: string[];
  activeFiltersCount: number;
  clearFilters: () => void;
  selectedWeek: Date;
  onWeekChange: (date: Date) => void;
}

export const WorkloadHeaderControls: React.FC<WorkloadHeaderControlsProps> = ({
  searchQuery,
  setSearchQuery,
  activeFilter,
  setActiveFilter,
  filterValue,
  setFilterValue,
  departments,
  locations,
  activeFiltersCount,
  clearFilters,
  selectedWeek,
  onWeekChange
}) => {
  return (
    <Card className="border-none shadow-sm bg-white">
      <CardContent className="p-4">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          
          {/* Week Selector - moved to the left */}
          <WeekStartSelector
            selectedWeek={selectedWeek}
            onWeekChange={onWeekChange}
          />

          {/* Search and Filters - moved to the right */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-8 w-48"
              />
            </div>

            <Select value={activeFilter} onValueChange={setActiveFilter}>
              <SelectTrigger className="w-36 h-8">
                <SelectValue placeholder="Filter by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Members</SelectItem>
                <SelectItem value="department">Department</SelectItem>
                <SelectItem value="location">Location</SelectItem>
              </SelectContent>
            </Select>

            {activeFilter && activeFilter !== "all" && (
              <Select value={filterValue} onValueChange={setFilterValue}>
                <SelectTrigger className="w-32 h-8">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  {activeFilter === 'department' && departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                  {activeFilter === 'location' && locations.map(loc => (
                    <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-8 px-2"
              >
                <X className="h-4 w-4" />
                Clear ({activeFiltersCount})
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
