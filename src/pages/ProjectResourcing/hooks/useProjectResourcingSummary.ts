import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { useTeamMembersData } from '@/hooks/useTeamMembersData';
import { useProjects } from '@/hooks/useProjects';
import { startOfWeek, addDays, format, isWithinInterval, startOfMonth, endOfMonth } from 'date-fns';

interface AvailableThisMonth {
  count: number;
  totalHours: number;
  members: Array<{ id: string; name: string; availableHours: number }>;
}

interface MultiProjectLoad {
  count: number;
  totalProjects: number;
  resources: Array<{ 
    id: string; 
    name: string; 
    projectCount: number;
    projects: string[];
  }>;
}

interface OverloadedResource {
  id: string;
  name: string;
  overloadDays: string[];
  maxOverload: number;
}

interface OverloadedResources {
  count: number;
  totalOverloadDays: number;
  resources: OverloadedResource[];
}

interface ResourceConflict {
  resourceId: string;
  resourceName: string;
  conflictType: 'scheduling' | 'capacity';
  projects: string[];
  date: string;
}

interface ResourceConflicts {
  count: number;
  conflicts: ResourceConflict[];
}

interface ProjectResourcingSummaryData {
  availableThisMonth: AvailableThisMonth;
  multiProjectLoad: MultiProjectLoad;
  overloadedResources: OverloadedResources;
  resourceConflicts: ResourceConflicts;
  isLoading: boolean;
}

export const useProjectResourcingSummary = (
  selectedMonth: Date, 
  periodToShow: number
): ProjectResourcingSummaryData => {
  const [summaryData, setSummaryData] = useState<ProjectResourcingSummaryData>({
    availableThisMonth: { count: 0, totalHours: 0, members: [] },
    multiProjectLoad: { count: 0, totalProjects: 0, resources: [] },
    overloadedResources: { count: 0, totalOverloadDays: 0, resources: [] },
    resourceConflicts: { count: 0, conflicts: [] },
    isLoading: true
  });

  const { company } = useCompany();
  const { teamMembers, isLoading: isLoadingMembers } = useTeamMembersData();
  const { projects, isLoading: isLoadingProjects } = useProjects();

  // Generate daily dates for the period
  const generatePeriodDates = useCallback(() => {
    const dates: Date[] = [];
    for (let i = 0; i < periodToShow; i++) {
      dates.push(addDays(selectedMonth, i));
    }
    return dates;
  }, [selectedMonth, periodToShow]);

  // Calculate summary data
  const calculateSummary = useCallback(async () => {
    if (!company?.id || isLoadingMembers || isLoadingProjects || !teamMembers.length) {
      return;
    }

    try {
      const periodDates = generatePeriodDates();
      const weekKeys = periodDates.map(date => format(startOfWeek(date, { weekStartsOn: 1 }), 'yyyy-MM-dd'));
      const uniqueWeekKeys = Array.from(new Set(weekKeys));

      // Fetch all allocations for this period
      // RULEBOOK: Weekly views show BOTH active AND pre_registered members
      const { data: allocations, error } = await supabase
        .from('project_resource_allocations')
        .select(`
          resource_id,
          allocation_date,
          hours,
          project_id,
          resource_type,
          projects(id, name)
        `)
        .eq('company_id', company.id)
        .in('resource_type', ['active', 'pre_registered'])
        .in('allocation_date', uniqueWeekKeys);

      if (error) throw error;

      // Initialize summary data
      const monthStart = startOfMonth(selectedMonth);
      const monthEnd = endOfMonth(selectedMonth);
      const dailyCapacity = 8; // 8 hours per day standard capacity
      
      // Process allocations by resource and date
      const resourceAllocationMap = new Map<string, Map<string, number>>();
      const resourceProjectMap = new Map<string, Set<string>>();
      
      (allocations || []).forEach(allocation => {
        const resourceId = allocation.resource_id;
        const weekStart = new Date(allocation.allocation_date);
        const hoursPerDay = allocation.hours / 7; // Distribute weekly hours across 7 days

        // Initialize maps if not exists
        if (!resourceAllocationMap.has(resourceId)) {
          resourceAllocationMap.set(resourceId, new Map());
        }
        if (!resourceProjectMap.has(resourceId)) {
          resourceProjectMap.set(resourceId, new Set());
        }

        // Add project to resource's project set
        if (allocation.project_id) {
          resourceProjectMap.get(resourceId)!.add(allocation.project_id);
        }

        // Calculate daily allocations for the week
        for (let i = 0; i < 7; i++) {
          const currentDate = addDays(weekStart, i);
          const dateKey = format(currentDate, 'yyyy-MM-dd');
          
          // Only consider dates within our period
          if (periodDates.some(d => format(d, 'yyyy-MM-dd') === dateKey)) {
            const currentHours = resourceAllocationMap.get(resourceId)!.get(dateKey) || 0;
            resourceAllocationMap.get(resourceId)!.set(dateKey, currentHours + hoursPerDay);
          }
        }
      });

      // Calculate Available This Month
      const availableMembers: Array<{ id: string; name: string; availableHours: number }> = [];
      teamMembers.forEach(member => {
        const memberAllocations = resourceAllocationMap.get(member.id) || new Map();
        
        // Calculate total allocated hours for this month
        let totalAllocatedHours = 0;
        periodDates.forEach(date => {
          if (isWithinInterval(date, { start: monthStart, end: monthEnd })) {
            const dateKey = format(date, 'yyyy-MM-dd');
            totalAllocatedHours += memberAllocations.get(dateKey) || 0;
          }
        });

        // Calculate capacity for working days in month
        const workingDaysInMonth = periodDates.filter(date => 
          isWithinInterval(date, { start: monthStart, end: monthEnd }) &&
          date.getDay() !== 0 && date.getDay() !== 6 // Exclude weekends
        ).length;
        
        const monthCapacity = workingDaysInMonth * dailyCapacity;
        const availableHours = monthCapacity - totalAllocatedHours;
        
        if (availableHours > 0) {
          availableMembers.push({
            id: member.id,
            name: `${member.first_name || ''} ${member.last_name || ''}`.trim() || member.email,
            availableHours: Math.round(availableHours)
          });
        }
      });

      // Calculate Multi-Project Load
      const multiProjectResources: Array<{ 
        id: string; 
        name: string; 
        projectCount: number;
        projects: string[];
      }> = [];
      
      teamMembers.forEach(member => {
        const memberProjects = resourceProjectMap.get(member.id);
        if (memberProjects && memberProjects.size > 1) {
          multiProjectResources.push({
            id: member.id,
            name: `${member.first_name || ''} ${member.last_name || ''}`.trim() || member.email,
            projectCount: memberProjects.size,
            projects: Array.from(memberProjects)
          });
        }
      });

      // Calculate Overloaded Resources
      const overloadedResourcesList: OverloadedResource[] = [];
      teamMembers.forEach(member => {
        const memberAllocations = resourceAllocationMap.get(member.id) || new Map();
        const overloadDays: string[] = [];
        let maxOverload = 0;

        periodDates.forEach(date => {
          // Skip weekends
          if (date.getDay() === 0 || date.getDay() === 6) return;

          const dateKey = format(date, 'yyyy-MM-dd');
          const dailyHours = memberAllocations.get(dateKey) || 0;
          
          if (dailyHours > dailyCapacity) {
            overloadDays.push(format(date, 'MMM d'));
            maxOverload = Math.max(maxOverload, dailyHours - dailyCapacity);
          }
        });

        if (overloadDays.length > 0) {
          overloadedResourcesList.push({
            id: member.id,
            name: `${member.first_name || ''} ${member.last_name || ''}`.trim() || member.email,
            overloadDays,
            maxOverload: Math.round(maxOverload)
          });
        }
      });

      // Calculate Resource Conflicts (simplified - looking for resources with multiple projects on same day)
      const conflicts: ResourceConflict[] = [];
      teamMembers.forEach(member => {
        const memberProjects = resourceProjectMap.get(member.id);
        if (memberProjects && memberProjects.size > 1) {
          // This is a simplified conflict detection - in practice, you'd want more sophisticated logic
          conflicts.push({
            resourceId: member.id,
            resourceName: `${member.first_name || ''} ${member.last_name || ''}`.trim() || member.email,
            conflictType: 'scheduling',
            projects: Array.from(memberProjects),
            date: format(new Date(), 'yyyy-MM-dd')
          });
        }
      });

      // Update state
      setSummaryData({
        availableThisMonth: {
          count: availableMembers.length,
          totalHours: availableMembers.reduce((sum, m) => sum + m.availableHours, 0),
          members: availableMembers.sort((a, b) => b.availableHours - a.availableHours)
        },
        multiProjectLoad: {
          count: multiProjectResources.length,
          totalProjects: new Set(multiProjectResources.flatMap(r => r.projects)).size,
          resources: multiProjectResources.sort((a, b) => b.projectCount - a.projectCount)
        },
        overloadedResources: {
          count: overloadedResourcesList.length,
          totalOverloadDays: overloadedResourcesList.reduce((sum, r) => sum + r.overloadDays.length, 0),
          resources: overloadedResourcesList.sort((a, b) => b.maxOverload - a.maxOverload)
        },
        resourceConflicts: {
          count: conflicts.length,
          conflicts: conflicts.slice(0, 10) // Limit to first 10 conflicts
        },
        isLoading: false
      });

    } catch (error) {
      console.error('Error calculating resource summary:', error);
      setSummaryData(prev => ({ ...prev, isLoading: false }));
    }
  }, [company?.id, teamMembers, projects, selectedMonth, periodToShow, isLoadingMembers, isLoadingProjects, generatePeriodDates]);

  useEffect(() => {
    setSummaryData(prev => ({ ...prev, isLoading: true }));
    calculateSummary();
  }, [calculateSummary]);

  return summaryData;
};