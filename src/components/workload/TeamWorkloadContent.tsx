
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Search, Filter, X, Calendar, Users, Clock, TrendingUp } from 'lucide-react';
import { TeamMember } from '@/components/dashboard/types';
import { WeeklyWorkloadCalendar } from './WeeklyWorkloadCalendar';
import { WeekStartSelector } from './WeekStartSelector';
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
  // Fixed to 36 weeks as requested
  const periodWeeks = 36;
  
  // Use the new weekly workload data hook with the selected week as starting point
  const { 
    weeklyWorkloadData, 
    isLoadingWorkload, 
    weekStartDates 
  } = useWeeklyWorkloadData(selectedWeek, filteredMembers, periodWeeks);

  const activeFiltersCount = [activeFilter !== 'all' ? activeFilter : '', searchQuery].filter(Boolean).length;

  // Calculate workload metrics
  const calculateWorkloadMetrics = () => {
    if (!weeklyWorkloadData || Object.keys(weeklyWorkloadData).length === 0) {
      return {
        totalCapacity: 0,
        totalAllocated: 0,
        utilizationRate: 0,
        overloadedMembers: 0,
        underUtilizedMembers: 0,
        availableHours: 0
      };
    }

    let totalCapacity = 0;
    let totalAllocated = 0;
    let overloadedMembers = 0;
    let underUtilizedMembers = 0;

    filteredMembers.forEach(member => {
      const weeklyCapacity = member.weekly_capacity || 40;
      const memberTotalCapacity = weeklyCapacity * periodWeeks;
      totalCapacity += memberTotalCapacity;

      const memberData = weeklyWorkloadData[member.id] || {};
      const memberTotalAllocated = Object.values(memberData).reduce((sum, week) => sum + (week?.total || 0), 0);
      totalAllocated += memberTotalAllocated;

      const memberUtilization = memberTotalCapacity > 0 ? (memberTotalAllocated / memberTotalCapacity) * 100 : 0;
      
      if (memberUtilization > 100) {
        overloadedMembers++;
      } else if (memberUtilization < 60) {
        underUtilizedMembers++;
      }
    });

    const utilizationRate = totalCapacity > 0 ? Math.round((totalAllocated / totalCapacity) * 100) : 0;
    const availableHours = Math.max(0, totalCapacity - totalAllocated);

    return {
      totalCapacity,
      totalAllocated,
      utilizationRate,
      overloadedMembers,
      underUtilizedMembers,
      availableHours
    };
  };

  const metrics = calculateWorkloadMetrics();

  if (isLoading || isLoadingWorkload) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-32 w-full" />
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

            {/* Week Selector */}
            <WeekStartSelector
              selectedWeek={selectedWeek}
              onWeekChange={onWeekChange}
            />
          </div>
        </CardContent>
      </Card>

      {/* Workload Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Team Utilization</p>
                <p className="text-2xl font-bold">{metrics.utilizationRate}%</p>
                <p className="text-xs text-gray-500">{metrics.totalAllocated}h / {metrics.totalCapacity}h</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Available Hours</p>
                <p className="text-2xl font-bold">{Math.round(metrics.availableHours)}h</p>
                <p className="text-xs text-gray-500">Next {periodWeeks} weeks</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium">Overloaded</p>
                <p className="text-2xl font-bold">{metrics.overloadedMembers}</p>
                <p className="text-xs text-gray-500">Over 100% capacity</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Under-utilized</p>
                <p className="text-2xl font-bold">{metrics.underUtilizedMembers}</p>
                <p className="text-xs text-gray-500">Under 60% capacity</p>
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
