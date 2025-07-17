
import React, { useMemo, useCallback, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Clock, TrendingUp, Calendar } from 'lucide-react';
import { WeekResourceHeader } from './WeekResourceHeader';
import { NewResourceTable } from './NewResourceTable';
import { useStreamlinedWeekResourceData } from './hooks/useStreamlinedWeekResourceData';
import { Skeleton } from '@/components/ui/skeleton';
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
  // View mode state for expand/collapse functionality
  const [viewMode, setViewMode] = useState<'compact' | 'expanded'>('compact');
  
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

  // Filter members based on search term
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

  // Weekly metrics calculation using the utility functions
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

      const memberProjectHours = calculateMemberProjectHours(member.id, allocationMap);
      totalProjectHours += memberProjectHours;

      const memberUtilization = calculateUtilizationPercentage(memberProjectHours, weeklyCapacity);
      
      if (memberUtilization > 100) {
        overloadedMembers++;
      } else if (memberUtilization < 60) {
        underUtilizedMembers++;
      }
    });

    const utilizationRate = totalCapacity > 0 ? Math.round((totalProjectHours / totalCapacity) * 100) : 0;
    const availableHours = Math.max(0, totalCapacity - totalProjectHours);

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
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <WeekResourceHeader
        selectedWeek={selectedWeek}
        onWeekChange={handleWeekChange}
        weekLabel={weekLabel}
        filters={filters}
        onFilterChange={onFilterChange}
        activeFiltersCount={activeFiltersCount}
        clearFilters={clearFilters}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Weekly Summary Stats */}
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
            viewMode={viewMode}
            selectedWeek={selectedWeek}
          />
        </CardContent>
      </Card>
    </div>
  );
};
