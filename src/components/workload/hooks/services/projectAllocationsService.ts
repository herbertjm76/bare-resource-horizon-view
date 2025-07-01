
import { supabase } from '@/integrations/supabase/client';
import { WorkloadDataParams, ProcessedWorkloadResult, WeeklyWorkloadBreakdown } from '../types';
import { format, startOfWeek, endOfWeek, addDays, addWeeks, parseISO } from 'date-fns';
import { investigateDataConsistency } from './dataInvestigationService';

export const fetchProjectAllocations = async (params: WorkloadDataParams) => {
  const { companyId, memberIds, startDate, numberOfWeeks } = params;
  
  // Calculate the end date for the period - include the full last week
  const endDate = addWeeks(startDate, numberOfWeeks);
  
  console.log('🔍 PROJECT ALLOCATIONS: Fetching with parameters:', {
    companyId,
    memberIds: memberIds.length,
    memberSample: memberIds.slice(0, 3),
    startDate: format(startDate, 'yyyy-MM-dd'),
    endDate: format(endDate, 'yyyy-MM-dd'),
    numberOfWeeks
  });

  // First, investigate the data structure
  const investigation = await investigateDataConsistency(companyId, memberIds);
  
  // Determine the correct resource type to use
  let resourceTypeFilter = 'team_member'; // default
  if (investigation.uniqueResourceTypes.length > 0) {
    // Use the first available resource type if 'team_member' doesn't exist
    if (!investigation.uniqueResourceTypes.includes('team_member')) {
      resourceTypeFilter = investigation.uniqueResourceTypes[0];
      console.log('🔍 PROJECT ALLOCATIONS: Using resource type:', resourceTypeFilter);
    }
  }

  // Try the query with the determined resource type
  let query = supabase
    .from('project_resource_allocations')
    .select(`
      *,
      projects!inner(id, name, code)
    `)
    .eq('company_id', companyId)
    .in('resource_id', memberIds)
    .gte('week_start_date', format(startDate, 'yyyy-MM-dd'))
    .lt('week_start_date', format(endDate, 'yyyy-MM-dd'));

  // Only add resource_type filter if we have resource types in the data
  if (investigation.uniqueResourceTypes.length > 0) {
    query = query.eq('resource_type', resourceTypeFilter);
  }

  const { data, error } = await query;

  if (error) {
    console.error('🔍 PROJECT ALLOCATIONS: Error fetching project allocations:', error);
    throw error;
  }

  console.log('🔍 PROJECT ALLOCATIONS: Final query result:', {
    count: data?.length || 0,
    sampleData: data?.slice(0, 3).map(item => ({
      resource_id: item.resource_id,
      week_start_date: item.week_start_date,
      hours: item.hours,
      project_name: item.projects?.name,
      resource_type: item.resource_type
    }))
  });

  // If we still have no data, try without any resource_type filter
  if (!data || data.length === 0) {
    console.log('🔍 PROJECT ALLOCATIONS: No data found, trying without resource_type filter...');
    
    const { data: fallbackData, error: fallbackError } = await supabase
      .from('project_resource_allocations')
      .select(`
        *,
        projects!inner(id, name, code)
      `)
      .eq('company_id', companyId)
      .in('resource_id', memberIds)
      .gte('week_start_date', format(startDate, 'yyyy-MM-dd'))
      .lt('week_start_date', format(endDate, 'yyyy-MM-dd'));

    console.log('🔍 PROJECT ALLOCATIONS: Fallback query result:', {
      count: fallbackData?.length || 0,
      sampleData: fallbackData?.slice(0, 3).map(item => ({
        resource_id: item.resource_id,
        week_start_date: item.week_start_date,
        hours: item.hours,
        project_name: item.projects?.name,
        resource_type: item.resource_type
      }))
    });

    if (fallbackError) {
      console.error('🔍 PROJECT ALLOCATIONS: Error in fallback query:', fallbackError);
    }

    return fallbackData || [];
  }

  return data || [];
};

export const processProjectAllocations = (
  allocations: any[],
  result: ProcessedWorkloadResult
) => {
  console.log('🔍 PROCESSING: Starting project allocations processing:', allocations.length);
  
  // Group allocations by member and week - aggregate multiple days within the same week
  const allocationsByMemberWeek = new Map<string, Map<string, number>>();
  const projectsByMemberWeek = new Map<string, Map<string, any[]>>();

  allocations.forEach((allocation, index) => {
    const memberId = allocation.resource_id;
    const allocationDate = parseISO(allocation.week_start_date);
    
    // Find the Monday of the week this allocation belongs to
    const weekStartDate = startOfWeek(allocationDate, { weekStartsOn: 1 });
    const weekKey = format(weekStartDate, 'yyyy-MM-dd');
    const hours = parseFloat(allocation.hours) || 0;

    console.log(`🔍 PROCESSING: Allocation ${index + 1} - Member: ${memberId}, Original Date: ${format(allocationDate, 'yyyy-MM-dd')}, Week Start: ${weekKey}, Hours: ${hours}, Project: ${allocation.projects?.name}`);

    // Initialize member maps if they don't exist
    if (!allocationsByMemberWeek.has(memberId)) {
      allocationsByMemberWeek.set(memberId, new Map());
      projectsByMemberWeek.set(memberId, new Map());
    }

    const memberWeekMap = allocationsByMemberWeek.get(memberId)!;
    const memberProjectMap = projectsByMemberWeek.get(memberId)!;

    // Sum hours for this member-week combination (aggregating multiple days in the same week)
    const currentHours = memberWeekMap.get(weekKey) || 0;
    memberWeekMap.set(weekKey, currentHours + hours);

    // Track projects for this member-week
    if (!memberProjectMap.has(weekKey)) {
      memberProjectMap.set(weekKey, []);
    }
    
    const projects = memberProjectMap.get(weekKey)!;
    const existingProject = projects.find(p => p.project_id === allocation.project_id);
    
    if (existingProject) {
      existingProject.hours += hours;
    } else {
      projects.push({
        project_id: allocation.project_id,
        project_name: allocation.projects?.name || 'Unknown Project',
        project_code: allocation.projects?.code || 'N/A',
        hours: hours
      });
    }

    console.log(`🔍 PROCESSING: Updated totals - Member: ${memberId}, Week: ${weekKey}, Total Hours: ${memberWeekMap.get(weekKey)}, Project Count: ${projects.length}`);
  });

  // Update the result with processed data
  console.log('🔍 PROCESSING: Updating result object...');
  allocationsByMemberWeek.forEach((weekMap, memberId) => {
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

      // Update project hours and projects
      result[memberId][weekKey].projectHours = totalHours;
      result[memberId][weekKey].projects = projectsByMemberWeek.get(memberId)?.get(weekKey) || [];
      
      // Recalculate total
      const breakdown = result[memberId][weekKey];
      breakdown.total = breakdown.projectHours + breakdown.annualLeave + breakdown.officeHolidays + breakdown.otherLeave;

      console.log(`🔍 PROCESSING: Final result for ${memberId}, week ${weekKey}:`, {
        projectHours: breakdown.projectHours,
        total: breakdown.total,
        projectCount: breakdown.projects.length,
        projects: breakdown.projects.map(p => `${p.project_name}: ${p.hours}h`)
      });
    });
  });

  console.log('🔍 PROCESSING: Finished processing project allocations. Members with data:', Object.keys(result).length);
  
  // Debug: Log final results summary
  Object.keys(result).forEach(memberId => {
    const memberData = result[memberId];
    const totalProjectHours = Object.values(memberData).reduce((sum, week) => sum + week.projectHours, 0);
    if (totalProjectHours > 0) {
      console.log(`🔍 PROCESSING: Member ${memberId} total project hours: ${totalProjectHours}`);
    }
  });
};
