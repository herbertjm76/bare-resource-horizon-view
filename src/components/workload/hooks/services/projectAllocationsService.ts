
import { supabase } from '@/integrations/supabase/client';
import { WorkloadDataParams, ProcessedWorkloadResult, WeeklyWorkloadBreakdown } from '../types';
import { format, startOfWeek, endOfWeek, addDays, addWeeks, parseISO } from 'date-fns';

export const fetchProjectAllocations = async (params: WorkloadDataParams) => {
  const { companyId, memberIds, startDate, numberOfWeeks } = params;
  
  // Generate all week start dates for the period to match Project Resourcing logic
  const weekStartDates = [];
  for (let i = 0; i < numberOfWeeks; i++) {
    const weekStart = addWeeks(startDate, i);
    weekStartDates.push(format(weekStart, 'yyyy-MM-dd'));
  }
  
  console.log('🔍 PROJECT ALLOCATIONS: Fetching with parameters:', {
    companyId,
    memberIds: memberIds.length,
    weekStartDates: weekStartDates.slice(0, 3) + '...',
    numberOfWeeks
  });

  // Use the SAME query approach as Project Resourcing (useDetailedWeeklyAllocations)
  const { data, error } = await supabase
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
    .in('week_start_date', weekStartDates)
    .gt('hours', 0);

  if (error) {
    console.error('🔍 PROJECT ALLOCATIONS: Error fetching project allocations:', error);
    throw error;
  }

  console.log('🔍 PROJECT ALLOCATIONS: Fetched allocations (using Project Resourcing logic):', data?.length || 0);
  
  return data || [];
};

export const processProjectAllocations = (
  allocations: any[],
  result: ProcessedWorkloadResult
) => {
  if (allocations.length === 0) {
    console.log('🔍 PROCESSING: No allocations to process');
    return;
  }

  console.log('🔍 PROCESSING: Processing', allocations.length, 'project allocations');
  
  // Use Maps for faster lookups and aggregation
  const memberWeekHours = new Map<string, Map<string, number>>();
  const memberWeekProjects = new Map<string, Map<string, Map<string, any>>>();

  // Single pass through allocations for aggregation
  for (const allocation of allocations) {
    const memberId = allocation.resource_id;
    // CRITICAL FIX: Use the exact week_start_date from database instead of recalculating
    // This ensures consistency between Project Resourcing and Team Workload
    const weekKey = allocation.week_start_date; // Use the database date directly
    const hours = parseFloat(allocation.hours) || 0;
    const projectId = allocation.project_id;

    console.log(`🔍 PROCESSING ALLOCATION: Member ${memberId}, Week ${weekKey}, Hours ${hours}, Project ${allocation.projects?.name || 'Unknown'}`);
    
    // Calculate the actual week boundary for this allocation to ensure consistent aggregation
    const allocationDate = parseISO(allocation.week_start_date);
    const normalizedWeekStart = startOfWeek(allocationDate, { weekStartsOn: 1 });
    const normalizedWeekKey = format(normalizedWeekStart, 'yyyy-MM-dd');

    // Initialize nested maps if needed - use normalized week key for consistent aggregation
    if (!memberWeekHours.has(memberId)) {
      memberWeekHours.set(memberId, new Map());
      memberWeekProjects.set(memberId, new Map());
    }
    if (!memberWeekProjects.get(memberId)!.has(normalizedWeekKey)) {
      memberWeekProjects.get(memberId)!.set(normalizedWeekKey, new Map());
    }

    // Aggregate hours using normalized week key for consistent totals
    const currentHours = memberWeekHours.get(memberId)!.get(normalizedWeekKey) || 0;
    const newTotal = currentHours + hours;
    memberWeekHours.get(memberId)!.set(normalizedWeekKey, newTotal);
    
    console.log(`🔍 WEEK AGGREGATION: Member ${memberId}, Week ${normalizedWeekKey}, Current: ${currentHours}h, Adding: ${hours}h, New Total: ${newTotal}h`);

    // Aggregate projects using normalized week key
    const projectsMap = memberWeekProjects.get(memberId)!.get(normalizedWeekKey)!;
    const existingProject = projectsMap.get(projectId);
    
    if (existingProject) {
      existingProject.hours += hours;
      console.log(`🔍 PROJECT AGGREGATION: Updated existing project ${allocation.projects?.name}, new hours: ${existingProject.hours}`);
    } else {
      projectsMap.set(projectId, {
        project_id: projectId,
        project_name: allocation.projects?.name || 'Unknown Project',
        project_code: allocation.projects?.code || 'N/A',
        hours: hours
      });
      console.log(`🔍 PROJECT AGGREGATION: Added new project ${allocation.projects?.name}, hours: ${hours}`);
    }
  }

  // Update result object
  memberWeekHours.forEach((weekMap, memberId) => {
    if (!result[memberId]) {
      result[memberId] = {};
    }

    weekMap.forEach((totalHours, normalizedWeekKey) => {
      if (!result[memberId][normalizedWeekKey]) {
        result[memberId][normalizedWeekKey] = {
          projectHours: 0,
          annualLeave: 0,
          officeHolidays: 0,
          otherLeave: 0,
          total: 0,
          projects: []
        };
      }

      // Set project hours and projects
      result[memberId][normalizedWeekKey].projectHours = totalHours;
      
      // Convert projects map to array
      const projectsMap = memberWeekProjects.get(memberId)?.get(normalizedWeekKey);
      result[memberId][normalizedWeekKey].projects = projectsMap ? Array.from(projectsMap.values()) : [];
      
      // Recalculate total
      const breakdown = result[memberId][normalizedWeekKey];
      breakdown.total = breakdown.projectHours + breakdown.annualLeave + breakdown.officeHolidays + breakdown.otherLeave;
      
      console.log(`🔍 FINAL RESULT: Member ${memberId}, Week ${normalizedWeekKey}, Total Hours: ${breakdown.total} (Project: ${breakdown.projectHours}, Projects: ${breakdown.projects.length})`);
    });
  });

  console.log('🔍 PROCESSING: Finished processing project allocations for', memberWeekHours.size, 'members');
};
