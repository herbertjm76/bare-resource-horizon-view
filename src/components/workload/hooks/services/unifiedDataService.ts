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
  
  // Calculate date range
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + (numberOfWeeks * 7) - 1);
  
  console.log('🔄 UNIFIED DATA SERVICE: Fetching workload data', {
    companyId,
    memberCount: members.length,
    startDate: format(startDate, 'yyyy-MM-dd'),
    endDate: format(endDate, 'yyyy-MM-dd'),
    numberOfWeeks,
    viewType: `${numberOfWeeks}-week-unified`
  });

  const memberIds = members.map(m => m.id);

  // Initialize result structure
  const result: UnifiedWorkloadResult = {};
  
  // Initialize all members and weeks with zero data
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
    // Use the EXACT same query logic as the working 12-week view
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

    // Use the EXACT same processing logic as the working 12-week view
    if (allocations && allocations.length > 0) {
      // Use Maps for faster lookups and aggregation (SAME as original working logic)
      const memberWeekHours = new Map<string, Map<string, number>>();
      const memberWeekProjects = new Map<string, Map<string, Map<string, any>>>();

      // Single pass through allocations for aggregation (SAME as original working logic)
      for (const allocation of allocations) {
        const memberId = allocation.resource_id;
        const hours = parseFloat(allocation.hours?.toString() || '0');
        const projectId = allocation.project_id;
        
        // Convert the allocation's week_start_date to the Monday of that week (SAME as original)
        const allocationDate = parseISO(allocation.week_start_date);
        const allocationWeekStart = startOfWeek(allocationDate, { weekStartsOn: 1 }); // Monday as week start
        const weekKey = format(allocationWeekStart, 'yyyy-MM-dd');

        console.log(`🔄 PROCESSING ALLOCATION: Member ${memberId}, Original Date: ${allocation.week_start_date}, Normalized Week: ${weekKey}, Hours ${hours}, Project ${allocation.projects?.name || 'Unknown'}`);

        // Initialize nested maps if needed (SAME as original)
        if (!memberWeekHours.has(memberId)) {
          memberWeekHours.set(memberId, new Map());
          memberWeekProjects.set(memberId, new Map());
        }
        if (!memberWeekProjects.get(memberId)!.has(weekKey)) {
          memberWeekProjects.get(memberId)!.set(weekKey, new Map());
        }

        // Aggregate hours for this week (SAME as original)
        const currentHours = memberWeekHours.get(memberId)!.get(weekKey) || 0;
        const newTotal = currentHours + hours;
        memberWeekHours.get(memberId)!.set(weekKey, newTotal);
        
        console.log(`🔄 WEEK AGGREGATION: Member ${memberId}, Week ${weekKey}, Current: ${currentHours}h, Adding: ${hours}h, New Total: ${newTotal}h`);

        // Aggregate projects for this week (SAME as original)
        const projectsMap = memberWeekProjects.get(memberId)!.get(weekKey)!;
        const existingProject = projectsMap.get(projectId);
        
        if (existingProject) {
          existingProject.hours += hours;
          console.log(`🔄 PROJECT AGGREGATION: Updated existing project ${allocation.projects?.name}, new hours: ${existingProject.hours}`);
        } else {
          projectsMap.set(projectId, {
            project_id: projectId,
            project_name: allocation.projects?.name || 'Unknown Project',
            project_code: allocation.projects?.code || 'N/A',
            hours: hours
          });
          console.log(`🔄 PROJECT AGGREGATION: Added new project ${allocation.projects?.name}, hours: ${hours}`);
        }
      }

      // Update result object with aggregated data (SAME as original logic)
      memberWeekHours.forEach((weekMap, memberId) => {
        if (!result[memberId]) {
          result[memberId] = {};
        }

        weekMap.forEach((totalHours, weekKey) => {
          if (!result[memberId][weekKey]) {
            result[memberId][weekKey] = {
              projectHours: 0,
              annualLeave: 0,
              officeHolidays: 0,
              otherLeave: 0,
              total: 0,
              projects: []
            };
          }

          // Set project hours and projects
          result[memberId][weekKey].projectHours = totalHours;
          
          // Convert projects map to array
          const projectsMap = memberWeekProjects.get(memberId)?.get(weekKey);
          result[memberId][weekKey].projects = projectsMap ? Array.from(projectsMap.values()) : [];
          
          // Recalculate total
          const breakdown = result[memberId][weekKey];
          breakdown.total = breakdown.projectHours + breakdown.annualLeave + breakdown.officeHolidays + breakdown.otherLeave;
          
          console.log(`🔄 FINAL RESULT: Member ${memberId}, Week ${weekKey}, Total Hours: ${breakdown.total} (Project: ${breakdown.projectHours}, Projects: ${breakdown.projects.length})`);
        });
      });

      console.log('🔄 PROCESSING: Finished processing project allocations for', memberWeekHours.size, 'members');
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