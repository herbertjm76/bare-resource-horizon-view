
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X, Calendar, Users, Clock, TrendingUp } from 'lucide-react';
import { WeekStartSelector } from '@/components/workload/WeekStartSelector';
import { NewResourceTable } from './NewResourceTable';
import { useWeeklyResourceData } from '@/components/weekly-overview/hooks/useWeeklyResourceData';
import { Skeleton } from '@/components/ui/skeleton';
import { format, isThisWeek } from 'date-fns';

interface WeekResourceViewProps {
  selectedWeek: Date;
  setSelectedWeek: (date: Date) => void;
  onWeekChange?: (date: Date) => void;
  weekLabel: string;
  filters: {
    office: string;
    searchTerm: string;
  };
  onFilterChange: (key: string, value: string) => void;
}

export const WeekResourceView: React.FC<WeekResourceViewProps> = ({
  selectedWeek,
  setSelectedWeek,
  onWeekChange,
  weekLabel,
  filters,
  onFilterChange
}) => {
  const { 
    allMembers, 
    projects, 
    isLoading, 
    getMemberAllocation,
    getMemberTotal,
    getProjectCount,
    getWeeklyLeave,
    allocationMap
  } = useWeeklyResourceData(selectedWeek, filters);

  const handleWeekChange = (date: Date) => {
    setSelectedWeek(date);
    if (onWeekChange) {
      onWeekChange(date);
    }
  };

  const clearFilters = () => {
    onFilterChange('office', 'all');
    onFilterChange('searchTerm', '');
  };

  const activeFiltersCount = [
    filters.office !== 'all' ? 'office' : '',
    filters.searchTerm ? 'search' : ''
  ].filter(Boolean).length;

  // Calculate weekly metrics
  const calculateWeeklyMetrics = () => {
    if (!allMembers || allMembers.length === 0) {
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

    allMembers.forEach(member => {
      const weeklyCapacity = member.weekly_capacity || 40;
      totalCapacity += weeklyCapacity;

      const memberTotal = getMemberTotal(member.id);
      totalAllocated += memberTotal;

      const memberUtilization = weeklyCapacity > 0 ? (memberTotal / weeklyCapacity) * 100 : 0;
      
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

  const metrics = calculateWeeklyMetrics();
  const isCurrentWeek = isThisWeek(selectedWeek);

  if (isLoading) {
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
                  value={filters.searchTerm}
                  onChange={(e) => onFilterChange('searchTerm', e.target.value)}
                  className="pl-8 h-8 w-48"
                />
              </div>

              <Select value={filters.office} onValueChange={(value) => onFilterChange('office', value)}>
                <SelectTrigger className="w-36 h-8">
                  <SelectValue placeholder="Filter by office..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Offices</SelectItem>
                </SelectContent>
              </Select>

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

            {/* Week Selector with Current Week Badge */}
            <div className="flex items-center gap-2">
              <WeekStartSelector
                selectedWeek={selectedWeek}
                onWeekChange={handleWeekChange}
              />
              {isCurrentWeek && (
                <Badge variant="brand" className="ml-2">
                  Current Week
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Week Utilization</p>
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
                <p className="text-xs text-gray-500">This week</p>
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

      {/* Weekly Resource Table */}
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">
            Weekly Resource Allocation - {format(selectedWeek, 'MMM d, yyyy')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <NewResourceTable 
            members={allMembers || []}
            projects={projects || []}
            allocationMap={allocationMap}
            annualLeaveData={[]}
            holidaysData={[]}
            getMemberTotal={getMemberTotal}
            getProjectCount={getProjectCount}
            getWeeklyLeave={getWeeklyLeave}
            viewMode="compact"
          />
        </CardContent>
      </Card>
    </div>
  );
};
