import { supabase } from '@/integrations/supabase/client';
import { WorkloadDataParams, ProcessedWorkloadResult, WeeklyWorkloadBreakdown } from '../types';
import { format, startOfWeek, endOfWeek, addDays, addWeeks } from 'date-fns';

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

  // First, let's see what's actually in the project_resource_allocations table
  const { data: debugData, error: debugError } = await supabase
    .from('project_resource_allocations')
    .select('*')
    .eq('company_id', companyId)
    .limit(5);

  console.log('🔍 PROJECT ALLOCATIONS DEBUG: Sample data in table:', debugData);
  if (debugError) {
    console.error('🔍 PROJECT ALLOCATIONS DEBUG: Error fetching sample data:', debugError);
  }

  // Also check if there are any allocations for our specific members
  const { data: memberDebugData, error: memberDebugError } = await supabase
    .from('project_resource_allocations')
    .select('*')
    .eq('company_id', companyId)
    .in('resource_id', memberIds)
    .limit(10);

  console.log('🔍 PROJECT ALLOCATIONS DEBUG: Allocations for our members:', memberDebugData);
  if (memberDebugError) {
    console.error('🔍 PROJECT ALLOCATIONS DEBUG: Error fetching member data:', memberDebugError);
  }

  // Now fetch the actual data with a broader date range to see if we have any data
  const { data, error } = await supabase
    .from('project_resource_allocations')
    .select(`
      *,
      projects!inner(id, name, code)
    `)
    .eq('company_id', companyId)
    .in('resource_id', memberIds)
    .gte('week_start_date', format(startDate, 'yyyy-MM-dd'))
    .lt('week_start_date', format(endDate, 'yyyy-MM-dd'))
    .eq('resource_type', 'team_member');

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
      project_name: item.projects?.name
    }))
  });

  // If we still have no data, let's try a much broader query to see if there's any data at all
  if (!data || data.length === 0) {
    console.log('🔍 PROJECT ALLOCATIONS: No data found, trying broader query...');
    
    const { data: broadData, error: broadError } = await supabase
      .from('project_resource_allocations')
      .select(`
        *,
        projects!inner(id, name, code)
      `)
      .eq('company_id', companyId)
      .in('resource_id', memberIds)
      .eq('resource_type', 'team_member')
      .limit(10);

    console.log('🔍 PROJECT ALLOCATIONS: Broader query result:', {
      count: broadData?.length || 0,
      sampleData: broadData?.slice(0, 3).map(item => ({
        resource_id: item.resource_id,
        week_start_date: item.week_start_date,
        hours: item.hours,
        project_name: item.projects?.name
      }))
    });

    if (broadError) {
      console.error('🔍 PROJECT ALLOCATIONS: Error in broader query:', broadError);
    }
  }

  return data || [];
};

export const processProjectAllocations = (
  allocations: any[],
  result: ProcessedWorkloadResult
) => {
  console.log('Processing project allocations for weekly aggregation:', allocations.length);
  
  // Group allocations by member and week
  const allocationsByMemberWeek = new Map<string, Map<string, number>>();
  const projectsByMemberWeek = new Map<string, Map<string, any[]>>();

  allocations.forEach(allocation => {
    const memberId = allocation.resource_id;
    const weekStartDate = new Date(allocation.week_start_date);
    const weekKey = format(weekStartDate, 'yyyy-MM-dd');
    const hours = parseFloat(allocation.hours) || 0;

    console.log(`Processing allocation - Member: ${memberId}, Week: ${weekKey}, Hours: ${hours}, Project: ${allocation.projects?.name}`);

    // Initialize member maps if they don't exist
    if (!allocationsByMemberWeek.has(memberId)) {
      allocationsByMemberWeek.set(memberId, new Map());
      projectsByMemberWeek.set(memberId, new Map());
    }

    const memberWeekMap = allocationsByMemberWeek.get(memberId)!;
    const memberProjectMap = projectsByMemberWeek.get(memberId)!;

    // Sum hours for this member-week combination
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

    console.log(`Updated totals - Member: ${memberId}, Week: ${weekKey}, Total Hours: ${memberWeekMap.get(weekKey)}, Project Count: ${projects.length}`);
  });

  // Update the result with processed data
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

      console.log(`Final result for ${memberId}, week ${weekKey}:`, {
        projectHours: breakdown.projectHours,
        total: breakdown.total,
        projectCount: breakdown.projects.length,
        projects: breakdown.projects.map(p => `${p.project_name}: ${p.hours}h`)
      });
    });
  });

  console.log('Finished processing project allocations. Members with data:', Object.keys(result).length);
  
  // Debug: Log sample results
  const sampleMemberId = Object.keys(result)[0];
  if (sampleMemberId) {
    const sampleWeeks = Object.keys(result[sampleMemberId]).slice(0, 3);
    console.log(`Sample data for member ${sampleMemberId}:`, 
      sampleWeeks.map(week => ({
        week,
        projectHours: result[sampleMemberId][week].projectHours,
        projects: result[sampleMemberId][week].projects.length
      }))
    );
  }
};
