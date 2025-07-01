
import { supabase } from '@/integrations/supabase/client';
import { WorkloadDataParams, ProcessedWorkloadResult, WeeklyWorkloadBreakdown } from '../types';
import { format, startOfWeek, endOfWeek, addDays, addWeeks, parseISO } from 'date-fns';

export const fetchProjectAllocations = async (params: WorkloadDataParams) => {
  const { companyId, memberIds, startDate, numberOfWeeks } = params;
  
  // Calculate the end date for the period - include the full last week
  const endDate = addWeeks(startDate, numberOfWeeks);
  
  console.log('🔍 PROJECT ALLOCATIONS: Fetching with parameters:', {
    companyId,
    memberIds: memberIds.length,
    startDate: format(startDate, 'yyyy-MM-dd'),
    endDate: format(endDate, 'yyyy-MM-dd'),
    numberOfWeeks
  });

  // Query for allocations with both 'active' and 'pre_registered' resource types
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
    .gte('week_start_date', format(startDate, 'yyyy-MM-dd'))
    .lt('week_start_date', format(endDate, 'yyyy-MM-dd'))
    .in('resource_type', ['active', 'pre_registered']);

  if (error) {
    console.error('🔍 PROJECT ALLOCATIONS: Error fetching project allocations:', error);
    throw error;
  }

  console.log('🔍 PROJECT ALLOCATIONS: Fetched allocations:', data?.length || 0);

  // If we still have no data, try a fallback query without resource_type filter
  if (!data || data.length === 0) {
    console.log('🔍 PROJECT ALLOCATIONS: No data found, trying fallback query...');
    
    const { data: fallbackData, error: fallbackError } = await supabase
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
      .lt('week_start_date', format(endDate, 'yyyy-MM-dd'));

    if (fallbackError) {
      console.error('🔍 PROJECT ALLOCATIONS: Error in fallback query:', fallbackError);
      throw fallbackError;
    }

    console.log('🔍 PROJECT ALLOCATIONS: Fallback query result:', fallbackData?.length || 0);
    return fallbackData || [];
  }

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
    const allocationDate = parseISO(allocation.week_start_date);
    const weekStartDate = startOfWeek(allocationDate, { weekStartsOn: 1 });
    const weekKey = format(weekStartDate, 'yyyy-MM-dd');
    const hours = parseFloat(allocation.hours) || 0;
    const projectId = allocation.project_id;

    // Initialize nested maps if needed
    if (!memberWeekHours.has(memberId)) {
      memberWeekHours.set(memberId, new Map());
      memberWeekProjects.set(memberId, new Map());
    }
    if (!memberWeekProjects.get(memberId)!.has(weekKey)) {
      memberWeekProjects.get(memberId)!.set(weekKey, new Map());
    }

    // Aggregate hours
    const currentHours = memberWeekHours.get(memberId)!.get(weekKey) || 0;
    memberWeekHours.get(memberId)!.set(weekKey, currentHours + hours);

    // Aggregate projects
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

  // Update result object
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
    });
  });

  console.log('🔍 PROCESSING: Finished processing project allocations for', memberWeekHours.size, 'members');
};
