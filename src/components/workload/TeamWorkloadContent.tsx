
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Search, Filter, X, Calendar, Users } from 'lucide-react';
import { TeamMember } from '@/components/dashboard/types';
import { WeeklyWorkloadCalendar } from './WeeklyWorkloadCalendar';
import { useWeeklyWorkloadData } from './hooks/useWeeklyWorkloadData';
import { Skeleton } from '@/components/ui/skeleton';

interface TeamWorkloadContentProps {
  selectedWeek: Date;
  onWeekChange: (date: Date) => void;
  isLoading: boolean;
  filteredMembers: TeamMember[];
  departments: string[];
  locations: string[];
  activeFilter: string;
  filterValue: string;
  searchQuery: string;
  setActiveFilter: (filter: string) => void;
  setFilterValue: (value: string) => void;
  setSearchQuery: (query: string) => void;
  clearFilters: () => void;
  weekLabel: string;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
}

export const TeamWorkloadContent: React.FC<TeamWorkloadContentProps> = ({
  selectedWeek,
  onWeekChange,
  isLoading,
  filteredMembers,
  departments,
  locations,
  activeFilter,
  filterValue,
  searchQuery,
  setActiveFilter,
  setFilterValue,
  setSearchQuery,
  clearFilters,
  weekLabel,
  onPreviousWeek,
  onNextWeek
}) => {
  const [periodWeeks, setPeriodWeeks] = useState<number>(4);
  
  // Use the new weekly workload data hook
  const { 
    weeklyWorkloadData, 
    isLoadingWorkload, 
    weekStartDates 
  } = useWeeklyWorkloadData(selectedWeek, filteredMembers, periodWeeks);

  const activeFiltersCount = [activeFilter, searchQuery].filter(Boolean).length;

  if (isLoading || isLoadingWorkload) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <Card className="border-none shadow-sm bg-white">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            {/* Week Navigation */}
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onPreviousWeek}
                className="h-8"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center gap-2 min-w-[200px]">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="font-medium text-sm">{weekLabel}</span>
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onNextWeek}
                className="h-8"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Period Selection */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Show weeks:</span>
              <Select value={periodWeeks.toString()} onValueChange={(value) => setPeriodWeeks(parseInt(value))}>
                <SelectTrigger className="w-20 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="6">6</SelectItem>
                  <SelectItem value="8">8</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Search and Filters */}
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

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Total Members</p>
                <p className="text-2xl font-bold">{filteredMembers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Weeks Shown</p>
                <p className="text-2xl font-bold">{periodWeeks}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Active Filters</p>
                <p className="text-2xl font-bold">{activeFiltersCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Workload Calendar */}
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Weekly Team Workload</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <WeeklyWorkloadCalendar
            members={filteredMembers}
            weeklyWorkloadData={weeklyWorkloadData}
            weekStartDates={weekStartDates}
          />
        </CardContent>
      </Card>
    </div>
  );
};
