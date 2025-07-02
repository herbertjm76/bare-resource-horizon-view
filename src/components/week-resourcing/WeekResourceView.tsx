import React, { useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X, Calendar, Users, Clock, TrendingUp } from 'lucide-react';
import { WeekStartSelector } from '@/components/workload/WeekStartSelector';
import { NewResourceTable } from './NewResourceTable';
import { useStreamlinedWeekResourceData } from './hooks/useStreamlinedWeekResourceData';
import { Skeleton } from '@/components/ui/skeleton';
import { format, isThisWeek } from 'date-fns';
import { calculateMemberProjectHours, calculateUtilizationPercentage } from './utils/utilizationCalculations';

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
  // Stabilize filters to prevent unnecessary re-renders
  const stableFilters = useMemo(() => ({
    office: filters.office,
    searchTerm: filters.searchTerm
  }), [filters.office, filters.searchTerm]);

  const { 
    allMembers, 
    projects, 
    isLoading, 
    getMemberTotal,
    getProjectCount,
    getWeeklyLeave,
    allocationMap,
    annualLeaveData,
    holidaysData,
    otherLeaveData,
    updateOtherLeave,
    error
  } = useStreamlinedWeekResourceData(selectedWeek, stableFilters);

  console.log('WeekResourceView - Data Summary:', {
    membersCount: allMembers?.length || 0,
    projectsCount: projects?.length || 0,
    allocationMapSize: allocationMap?.size || 0,
    isLoading,
    hasError: !!error
  });

  // Filter members based on search term - make this more stable
  const filteredMembers = useMemo(() => {
    if (!allMembers || allMembers.length === 0) {
      return [];
    }
    
    // Apply search filter
    if (!stableFilters.searchTerm) {
      return allMembers;
    }
    
    const searchLower = stableFilters.searchTerm.toLowerCase();
    const filtered = allMembers.filter(member => {
      const fullName = `${member.first_name || ''} ${member.last_name || ''}`.toLowerCase();
      const email = (member.email || '').toLowerCase();
      return fullName.includes(searchLower) || email.includes(searchLower);
    });
    
    return filtered;
  }, [allMembers, stableFilters.searchTerm]);

  // Stable callback functions
  const handleWeekChange = useCallback((date: Date) => {
    setSelectedWeek(date);
    if (onWeekChange) {
      onWeekChange(date);
    }
  }, [setSelectedWeek, onWeekChange]);

  const clearFilters = useCallback(() => {
    onFilterChange('office', 'all');
    onFilterChange('searchTerm', '');
  }, [onFilterChange]);

  const activeFiltersCount = useMemo(() => [
    filters.office !== 'all' ? 'office' : '',
    filters.searchTerm ? 'search' : ''
  ].filter(Boolean).length, [filters.office, filters.searchTerm]);

  // FINAL STANDARDIZED weekly metrics calculation using the utility functions
  const metrics = useMemo(() => {
    if (!filteredMembers || filteredMembers.length === 0 || !allocationMap) {
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
    let totalProjectHours = 0;
    let overloadedMembers = 0;
    let underUtilizedMembers = 0;

    filteredMembers.forEach(member => {
      const weeklyCapacity = member.weekly_capacity || 40;
      totalCapacity += weeklyCapacity;

      // Use FINAL STANDARDIZED calculation for project hours
      const memberProjectHours = calculateMemberProjectHours(member.id, allocationMap);
      totalProjectHours += memberProjectHours;

      // Use FINAL STANDARDIZED utilization calculation
      const memberUtilization = calculateUtilizationPercentage(memberProjectHours, weeklyCapacity);
      
      if (memberUtilization > 100) {
        overloadedMembers++;
      } else if (memberUtilization < 60) {
        underUtilizedMembers++;
      }
    });

    const utilizationRate = totalCapacity > 0 ? Math.round((totalProjectHours / totalCapacity) * 100) : 0;
    const availableHours = Math.max(0, totalCapacity - totalProjectHours);

    console.log('FINAL STANDARDIZED Weekly Metrics:', {
      totalCapacity,
      totalProjectHours,
      utilizationRate,
      overloadedMembers,
      underUtilizedMembers,
      availableHours,
      calculation: `${totalProjectHours} / ${totalCapacity} * 100 = ${utilizationRate}%`
    });

    return {
      totalCapacity,
      totalAllocated: totalProjectHours,
      utilizationRate,
      overloadedMembers,
      underUtilizedMembers,
      availableHours
    };
  }, [filteredMembers, allocationMap]);

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-red-600 text-sm">Error loading data: {error.message}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
            size="sm"
          >
            Reload Page
          </Button>
        </div>
      </div>
    );
  }

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
            {/* Week Selector and Search */}
            <div className="flex items-center gap-4">
              <WeekStartSelector
                selectedWeek={selectedWeek}
                onWeekChange={handleWeekChange}
              />

              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search members..."
                  value={filters.searchTerm}
                  onChange={(e) => onFilterChange('searchTerm', e.target.value)}
                  className="pl-8 h-8 w-48 text-sm"
                />
              </div>

              <Select value={filters.office} onValueChange={(value) => onFilterChange('office', value)}>
                <SelectTrigger className="w-36 h-8 text-sm">
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
                  className="h-8 px-2 text-sm"
                >
                  <X className="h-4 w-4" />
                  Clear ({activeFiltersCount})
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Summary Stats with FINAL STANDARDIZED calculations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Week Utilization</p>
                <p className="text-2xl font-bold">{metrics.utilizationRate}%</p>
                <p className="text-xs text-gray-500">{Math.round(metrics.totalAllocated)}h / {metrics.totalCapacity}h</p>
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
        <CardContent className="p-0">
          <NewResourceTable 
            members={filteredMembers}
            projects={projects}
            allocationMap={allocationMap}
            annualLeaveData={annualLeaveData}
            holidaysData={holidaysData}
            otherLeaveData={otherLeaveData}
            getMemberTotal={getMemberTotal}
            getProjectCount={getProjectCount}
            getWeeklyLeave={getWeeklyLeave}
            updateOtherLeave={updateOtherLeave}
            viewMode="compact"
            selectedWeek={selectedWeek}
          />
        </CardContent>
      </Card>
    </div>
  );
};
