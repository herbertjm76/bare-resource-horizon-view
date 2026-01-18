
import React, { useMemo, useCallback, useState } from 'react';
import { NewResourceTable } from './NewResourceTable';
import { ProjectRowTable } from './ProjectRowTable';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { calculateMemberProjectHours, calculateUtilizationPercentage } from './utils/utilizationCalculations';
import { format, startOfWeek } from 'date-fns';
import { useAppSettings } from '@/hooks/useAppSettings';

interface WeekResourceViewProps {
  selectedWeek: Date;
  weekLabel: string;
  tableOrientation?: 'per-person' | 'per-project';
  // Data from parent - single source of truth
  allMembers: any[];
  projects: any[];
  isLoading: boolean;
  error: Error | null;
  allocationMap: Map<string, number>;
  annualLeaveData: Record<string, number>;
  holidaysData: Record<string, number>;
  otherLeaveData: Record<string, number>;
  getMemberTotal: (memberId: string) => number;
  getProjectCount: (memberId: string) => number;
  getWeeklyLeave: (memberId: string) => Array<{ date: string; hours: number }>;
  updateOtherLeave: (memberId: string, hours: number, notes?: string) => Promise<boolean>;
  searchTerm?: string;
}

export const WeekResourceView: React.FC<WeekResourceViewProps> = ({
  selectedWeek,
  weekLabel,
  tableOrientation = 'per-person',
  // Data from parent
  allMembers,
  projects,
  isLoading,
  error,
  allocationMap,
  annualLeaveData,
  holidaysData,
  otherLeaveData,
  getMemberTotal,
  getProjectCount,
  getWeeklyLeave,
  updateOtherLeave,
  searchTerm = ''
}) => {
  // View mode state for expand/collapse functionality
  const [viewMode, setViewMode] = useState<'compact' | 'expanded'>('compact');
  const { workWeekHours } = useAppSettings();
  const filteredMembers = useMemo(() => {
    if (!allMembers || allMembers.length === 0) {
      return [];
    }
    
    // Apply search filter only - allMembers is already sorted
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return allMembers.filter(member => {
        const fullName = `${member.first_name || ''} ${member.last_name || ''}`.toLowerCase();
        const email = (member.email || '').toLowerCase();
        return fullName.includes(searchLower) || email.includes(searchLower);
      });
    }
    
    return allMembers;
  }, [allMembers, searchTerm]);

  // Weekly metrics calculation using the utility functions - INCLUDE LEAVE HOURS
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
    let totalLeaveHours = 0;
    let overloadedMembers = 0;
    let underUtilizedMembers = 0;

    filteredMembers.forEach(member => {
      const weeklyCapacity = member.weekly_capacity || workWeekHours;
      totalCapacity += weeklyCapacity;

      const memberProjectHours = calculateMemberProjectHours(member.id, allocationMap);
      totalProjectHours += memberProjectHours;

      // Include leave hours in utilization calculation
      const memberAnnualLeave = annualLeaveData[member.id] || 0;
      const memberHolidayHours = holidaysData[member.id] || 0;
      const memberOtherLeave = otherLeaveData[member.id] || 0;
      const memberLeaveHours = memberAnnualLeave + memberHolidayHours + memberOtherLeave;
      totalLeaveHours += memberLeaveHours;

      const memberUtilization = calculateUtilizationPercentage(memberProjectHours, weeklyCapacity, memberLeaveHours);
      
      if (memberUtilization > 100) {
        overloadedMembers++;
      } else if (memberUtilization < 60) {
        underUtilizedMembers++;
      }
    });

    const totalAllocated = totalProjectHours + totalLeaveHours;
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
  }, [filteredMembers, allocationMap, annualLeaveData, holidaysData, otherLeaveData]);

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
    <div className="w-full">
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
    </div>
  );
};
