import { supabase } from '@/integrations/supabase/client';
import { format, startOfWeek, endOfWeek, addDays, parseISO } from 'date-fns';
import { TeamMember } from '@/components/dashboard/types';

export interface UnifiedWorkloadParams {
  companyId: string;
  members: TeamMember[];
  startDate: Date;
  numberOfWeeks: number;
}

export interface ProjectAllocation {
  resource_id: string;
  project_id: string;
  week_start_date: string;
  hours: number;
  resource_type: string;
  projects: {
    id: string;
    name: string;
    code: string;
  };
}

export interface WeeklyBreakdown {
  projectHours: number;
  annualLeave: number;
  officeHolidays: number;
  otherLeave: number;
  total: number;
  projects: Array<{
    project_id: string;
    project_name: string;
    project_code: string;
    hours: number;
  }>;
}

export interface UnifiedWorkloadResult {
  [memberId: string]: {
    [weekKey: string]: WeeklyBreakdown;
  };
}

export const fetchUnifiedWorkloadData = async (params: UnifiedWorkloadParams): Promise<UnifiedWorkloadResult> => {
  const { companyId, members, startDate, numberOfWeeks } = params;
  
  // Calculate date range for the entire period
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + (numberOfWeeks * 7) - 1);
  
  console.log('🔄 UNIFIED DATA SERVICE: Fetching workload data with STANDARDIZED logic', {
    companyId,
    memberCount: members.length,
    startDate: format(startDate, 'yyyy-MM-dd'),
    endDate: format(endDate, 'yyyy-MM-dd'),
    numberOfWeeks,
    viewType: `${numberOfWeeks}-week-unified`
  });

  const memberIds = members.map(m => m.id);

  // Initialize result structure with all weeks
  const result: UnifiedWorkloadResult = {};
  
  members.forEach(member => {
    result[member.id] = {};
    for (let week = 0; week < numberOfWeeks; week++) {
      const weekStart = new Date(startDate);
      weekStart.setDate(weekStart.getDate() + (week * 7));
      const weekKey = format(startOfWeek(weekStart, { weekStartsOn: 1 }), 'yyyy-MM-dd');
      
      result[member.id][weekKey] = {
        projectHours: 0,
        annualLeave: 0,
        officeHolidays: 0,
        otherLeave: 0,
        total: 0,
        projects: []
      };
    }
  });

  try {
    // Fetch project allocations using the working logic
    const { data: allocations, error: allocationsError } = await supabase
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
      .gt('hours', 0);

    if (allocationsError) {
      console.error('🔄 UNIFIED DATA SERVICE: Error fetching allocations:', allocationsError);
      throw allocationsError;
    }

    console.log('🔄 UNIFIED DATA SERVICE: Fetched allocations:', allocations?.length || 0);

    // Process allocations - this is the CORRECTED logic
    if (allocations && allocations.length > 0) {
      // Track total hours per member per week 
      const memberWeekTotals = new Map<string, Map<string, number>>();
      const memberWeekProjects = new Map<string, Map<string, Array<any>>>();

      for (const allocation of allocations) {
        const memberId = allocation.resource_id;
        const weeklyHours = parseFloat(allocation.hours?.toString() || '0');
        const projectId = allocation.project_id;
        
        // Normalize the week start date to Monday
        const allocationDate = parseISO(allocation.week_start_date);
        const normalizedWeekStart = startOfWeek(allocationDate, { weekStartsOn: 1 });
        const weekKey = format(normalizedWeekStart, 'yyyy-MM-dd');

        console.log(`🔄 STANDARDIZED PROCESSING: Member ${memberId}, Week ${weekKey}, Hours ${weeklyHours}, Project ${allocation.projects?.name || 'Unknown'}`);

        // Initialize if needed
        if (!memberWeekTotals.has(memberId)) {
          memberWeekTotals.set(memberId, new Map());
          memberWeekProjects.set(memberId, new Map());
        }
        if (!memberWeekProjects.get(memberId)!.has(weekKey)) {
          memberWeekProjects.get(memberId)!.set(weekKey, []);
        }

        // Add to weekly total
        const currentTotal = memberWeekTotals.get(memberId)!.get(weekKey) || 0;
        memberWeekTotals.get(memberId)!.set(weekKey, currentTotal + weeklyHours);
        
        // Add project details
        memberWeekProjects.get(memberId)!.get(weekKey)!.push({
          project_id: projectId,
          project_name: allocation.projects?.name || 'Unknown Project',
          project_code: allocation.projects?.code || 'N/A',
          hours: weeklyHours
        });

        console.log(`🔄 STANDARDIZED AGGREGATION: Member ${memberId}, Week ${weekKey}, New Total: ${currentTotal + weeklyHours}h`);
      }

      // Update result with standardized totals
      memberWeekTotals.forEach((weekTotals, memberId) => {
        weekTotals.forEach((totalHours, weekKey) => {
          if (result[memberId] && result[memberId][weekKey]) {
            result[memberId][weekKey].projectHours = totalHours;
            result[memberId][weekKey].projects = memberWeekProjects.get(memberId)?.get(weekKey) || [];
            result[memberId][weekKey].total = totalHours; // Will be updated after adding leave data
            
            console.log(`🔄 STANDARDIZED RESULT: Member ${memberId}, Week ${weekKey}, Project Hours: ${totalHours}`);
          }
        });
      });
    }

    // Fetch annual leave data
    const { data: annualLeaves, error: leaveError } = await supabase
      .from('annual_leaves')
      .select('*')
      .eq('company_id', companyId)
      .in('member_id', memberIds)
      .gte('date', format(startDate, 'yyyy-MM-dd'))
      .lte('date', format(endDate, 'yyyy-MM-dd'));

    if (leaveError) {
      console.error('🔄 UNIFIED DATA SERVICE: Error fetching annual leave:', leaveError);
    } else if (annualLeaves && annualLeaves.length > 0) {
      console.log('🔄 UNIFIED DATA SERVICE: Fetched annual leaves:', annualLeaves.length);
      
      annualLeaves.forEach(leave => {
        const memberId = leave.member_id;
        const leaveDate = parseISO(leave.date);
        const weekStart = startOfWeek(leaveDate, { weekStartsOn: 1 });
        const weekKey = format(weekStart, 'yyyy-MM-dd');
        const hours = parseFloat(leave.hours?.toString() || '0');

        if (result[memberId] && result[memberId][weekKey]) {
          result[memberId][weekKey].annualLeave += hours;
          result[memberId][weekKey].total += hours;
        }
      });
    }

    // Fetch other leave data
    const { data: otherLeaves, error: otherLeaveError } = await supabase
      .from('weekly_other_leave')
      .select('*')
      .eq('company_id', companyId)
      .in('member_id', memberIds)
      .gte('week_start_date', format(startDate, 'yyyy-MM-dd'))
      .lte('week_start_date', format(endDate, 'yyyy-MM-dd'));

    if (otherLeaveError) {
      console.error('🔄 UNIFIED DATA SERVICE: Error fetching other leave:', otherLeaveError);
    } else if (otherLeaves && otherLeaves.length > 0) {
      console.log('🔄 UNIFIED DATA SERVICE: Fetched other leaves:', otherLeaves.length);
      
      otherLeaves.forEach(leave => {
        const memberId = leave.member_id;
        const leaveDate = parseISO(leave.week_start_date);
        const weekStart = startOfWeek(leaveDate, { weekStartsOn: 1 });
        const weekKey = format(weekStart, 'yyyy-MM-dd');
        const hours = parseFloat(leave.hours?.toString() || '0');

        if (result[memberId] && result[memberId][weekKey]) {
          result[memberId][weekKey].otherLeave += hours;
          result[memberId][weekKey].total += hours;
        }
      });
    }

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