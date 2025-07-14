import { format, startOfWeek, isWithinInterval, addDays, parseISO } from 'date-fns';
import { TeamMember } from '@/components/dashboard/types';
import { supabase } from '@/integrations/supabase/client';
import { WeeklyWorkloadBreakdown } from '../types';
import { initializeWorkloadResult } from './workloadDataInitializer';

export interface UnifiedWorkloadParams {
  companyId: string;
  members: TeamMember[];
  startDate: Date;
  numberOfWeeks: number;
}

export interface WeeklyBreakdown extends WeeklyWorkloadBreakdown {}

export interface UnifiedWorkloadResult {
  [memberId: string]: {
    [weekKey: string]: WeeklyBreakdown;
  };
}

export const fetchUnifiedWorkloadData = async (params: UnifiedWorkloadParams): Promise<UnifiedWorkloadResult> => {
  const { companyId, members, startDate, numberOfWeeks } = params;
  
  console.log('🔄 UNIFIED DATA SERVICE: Fetching workload data with STANDARDIZED logic', {
    companyId,
    memberCount: members.length,
    startDate: format(startDate, 'yyyy-MM-dd'),
    numberOfWeeks,
    viewType: `${numberOfWeeks}-week-unified`
  });

  const memberIds = members.map(m => m.id);

  try {
    // Initialize result structure with all weeks
    const result = initializeWorkloadResult(members, startDate, numberOfWeeks);

    // Calculate date range
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + (numberOfWeeks * 7) - 1);

    // Fetch ALL data in parallel - SINGLE DATA FETCH POINT
    const [projectAllocations, annualLeaves, otherLeaves] = await Promise.all([
      // Project allocations
      supabase
        .from('project_resource_allocations')
        .select(`
          resource_id,
          project_id,
          hours,
          week_start_date,
          resource_type,
          projects!inner(id, name, code)
        `)
        .eq('company_id', companyId)
        .in('resource_id', memberIds)
        .gte('week_start_date', format(startDate, 'yyyy-MM-dd'))
        .lte('week_start_date', format(endDate, 'yyyy-MM-dd'))
        .gt('hours', 0),

      // Annual leave
      supabase
        .from('annual_leaves')
        .select('member_id, date, hours')
        .eq('company_id', companyId)
        .in('member_id', memberIds)
        .gte('date', format(startDate, 'yyyy-MM-dd'))
        .lte('date', format(endDate, 'yyyy-MM-dd')),

      // Other leave
      supabase
        .from('weekly_other_leave')
        .select('member_id, week_start_date, hours')
        .eq('company_id', companyId)
        .in('member_id', memberIds)
        .gte('week_start_date', format(startDate, 'yyyy-MM-dd'))
        .lte('week_start_date', format(endDate, 'yyyy-MM-dd'))
    ]);

    console.log('🔄 UNIFIED DATA SERVICE: Raw data fetched:', {
      projectAllocations: projectAllocations.data?.length || 0,
      annualLeaves: annualLeaves.data?.length || 0,
      otherLeaves: otherLeaves.data?.length || 0
    });

    // Process project allocations
    if (projectAllocations.data && projectAllocations.data.length > 0) {
      const memberWeekHours = new Map<string, Map<string, number>>();
      const memberWeekProjects = new Map<string, Map<string, Map<string, any>>>();

      for (const allocation of projectAllocations.data) {
        const memberId = allocation.resource_id;
        const hours = typeof allocation.hours === 'string' ? parseFloat(allocation.hours) || 0 : allocation.hours || 0;
        const projectId = allocation.project_id;
        
        const allocationDate = parseISO(allocation.week_start_date);
        const allocationWeekStart = startOfWeek(allocationDate, { weekStartsOn: 1 });
        const weekKey = format(allocationWeekStart, 'yyyy-MM-dd');
        
        if (!memberWeekHours.has(memberId)) {
          memberWeekHours.set(memberId, new Map());
          memberWeekProjects.set(memberId, new Map());
        }
        if (!memberWeekProjects.get(memberId)!.has(weekKey)) {
          memberWeekProjects.get(memberId)!.set(weekKey, new Map());
        }

        const currentHours = memberWeekHours.get(memberId)!.get(weekKey) || 0;
        memberWeekHours.get(memberId)!.set(weekKey, currentHours + hours);
        
        const projectsMap = memberWeekProjects.get(memberId)!.get(weekKey)!;
        const existingProject = projectsMap.get(projectId);
        
        if (existingProject) {
          existingProject.hours += hours;
        } else {
          projectsMap.set(projectId, {
            project_id: projectId,
            project_name: allocation.projects?.name || 'Unknown Project',
            project_code: allocation.projects?.code || 'N/A',
            hours: hours
          });
        }
      }

      // Update result with project data
      memberWeekHours.forEach((weekMap, memberId) => {
        weekMap.forEach((totalHours, weekKey) => {
          if (result[memberId] && result[memberId][weekKey]) {
            result[memberId][weekKey].projectHours = totalHours;
            const projectsMap = memberWeekProjects.get(memberId)?.get(weekKey);
            result[memberId][weekKey].projects = projectsMap ? Array.from(projectsMap.values()) : [];
          }
        });
      });
    }

    // Process annual leave
    if (annualLeaves.data && annualLeaves.data.length > 0) {
      const memberWeekHours = new Map<string, Map<string, number>>();

      for (const leave of annualLeaves.data) {
        const memberId = leave.member_id;
        const leaveDate = new Date(leave.date);
        const hours = typeof leave.hours === 'string' ? parseFloat(leave.hours) || 0 : leave.hours || 0;
        
        const weekStart = startOfWeek(leaveDate, { weekStartsOn: 1 });
        const weekKey = format(weekStart, 'yyyy-MM-dd');

        if (!memberWeekHours.has(memberId)) {
          memberWeekHours.set(memberId, new Map());
        }

        const currentHours = memberWeekHours.get(memberId)!.get(weekKey) || 0;
        memberWeekHours.get(memberId)!.set(weekKey, currentHours + hours);
      }

      // Update result with annual leave data
      memberWeekHours.forEach((weekMap, memberId) => {
        weekMap.forEach((totalHours, weekKey) => {
          if (result[memberId] && result[memberId][weekKey]) {
            result[memberId][weekKey].annualLeave = totalHours;
          }
        });
      });
    }

    // Process other leave
    if (otherLeaves.data && otherLeaves.data.length > 0) {
      const memberWeekHours = new Map<string, Map<string, number>>();

      for (const leave of otherLeaves.data) {
        const memberId = leave.member_id;
        const weekStartDate = new Date(leave.week_start_date);
        const weekKey = format(weekStartDate, 'yyyy-MM-dd');
        const hours = typeof leave.hours === 'string' ? parseFloat(leave.hours) || 0 : leave.hours || 0;

        if (!memberWeekHours.has(memberId)) {
          memberWeekHours.set(memberId, new Map());
        }

        const currentHours = memberWeekHours.get(memberId)!.get(weekKey) || 0;
        memberWeekHours.get(memberId)!.set(weekKey, currentHours + hours);
      }

      // Update result with other leave data
      memberWeekHours.forEach((weekMap, memberId) => {
        weekMap.forEach((totalHours, weekKey) => {
          if (result[memberId] && result[memberId][weekKey]) {
            result[memberId][weekKey].otherLeave = totalHours;
          }
        });
      });
    }

    // Calculate totals for all members and weeks
    Object.keys(result).forEach(memberId => {
      Object.keys(result[memberId]).forEach(weekKey => {
        const breakdown = result[memberId][weekKey];
        breakdown.total = breakdown.projectHours + breakdown.annualLeave + breakdown.officeHolidays + breakdown.otherLeave;
      });
    });

    console.log('🔄 UNIFIED DATA SERVICE: Processing complete', {
      membersWithData: Object.keys(result).filter(memberId => 
        Object.values(result[memberId]).some(week => week.total > 0)
      ).length,
      totalMembers: Object.keys(result).length,
      numberOfWeeks,
      viewType: `${numberOfWeeks}-week-unified`
    });

    return result;

  } catch (error) {
    console.error('🔄 UNIFIED DATA SERVICE: Error in fetchUnifiedWorkloadData:', error);
    throw error;
  }
};