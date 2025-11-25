
import React, { useMemo, useCallback, useState } from 'react';
import { NewResourceTable } from './NewResourceTable';
import { ProjectRowTable } from './ProjectRowTable';
import { useStreamlinedWeekResourceData } from './hooks/useStreamlinedWeekResourceData';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { calculateMemberProjectHours, calculateUtilizationPercentage } from './utils/utilizationCalculations';
import { format, startOfWeek } from 'date-fns';

interface WeekResourceViewProps {
  selectedWeek: Date;
  setSelectedWeek: (date: Date) => void;
  onWeekChange?: (date: Date) => void;
  weekLabel: string;
  filters: {
    practiceArea: string;
    department: string;
    location: string;
    searchTerm: string;
  };
  onFilterChange: (key: string, value: string) => void;
  tableOrientation?: 'per-person' | 'per-project';
}

export const WeekResourceView: React.FC<WeekResourceViewProps> = ({
  selectedWeek,
  setSelectedWeek,
  onWeekChange,
  weekLabel,
  filters,
  onFilterChange,
  tableOrientation = 'per-person'
}) => {
  // View mode state for expand/collapse functionality
  const [viewMode, setViewMode] = useState<'compact' | 'expanded'>('compact');
  
  // Stabilize filters to prevent unnecessary re-renders
  const stableFilters = useMemo(() => ({
    practiceArea: filters.practiceArea === 'all' ? '' : filters.practiceArea,
    department: filters.department === 'all' ? '' : filters.department,
    location: filters.location === 'all' ? '' : filters.location,
    searchTerm: filters.searchTerm
  }), [filters.practiceArea, filters.department, filters.location, filters.searchTerm]);

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
    onFilterChange('sector', 'all');
    onFilterChange('department', 'all');
    onFilterChange('location', 'all');
    onFilterChange('searchTerm', '');
  }, [onFilterChange]);

  const activeFiltersCount = useMemo(() => [
    filters.practiceArea !== 'all' ? 'practiceArea' : '',
    filters.department !== 'all' ? 'department' : '',
    filters.location !== 'all' ? 'location' : '',
    filters.searchTerm ? 'search' : ''
  ].filter(Boolean).length, [filters.practiceArea, filters.department, filters.location, filters.searchTerm]);

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
    <div className="table-responsive-wrapper">
      {/* Resource Table - Header, filters, and metrics shown in parent */}
      {tableOrientation === 'per-person' ? (
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
      ) : (
        <ProjectRowTable
          projects={projects}
          members={filteredMembers}
          allocationMap={allocationMap}
          weekStartDate={format(startOfWeek(selectedWeek, { weekStartsOn: 1 }), 'yyyy-MM-dd')}
        />
      )}
    </div>
  );
};
