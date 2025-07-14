
import { supabase } from '@/integrations/supabase/client';
import { WorkloadDataParams, ProcessedWorkloadResult, WeeklyWorkloadBreakdown } from '../types';
import { format, startOfWeek, endOfWeek, addDays, addWeeks, parseISO } from 'date-fns';

export const fetchProjectAllocations = async (params: WorkloadDataParams) => {
  const { companyId, memberIds, startDate, numberOfWeeks } = params;
  
  // Calculate the full date range to capture all days in all weeks
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + (numberOfWeeks * 7) - 1);
  
  console.log('🔍 PROJECT ALLOCATIONS: Fetching with parameters:', {
    companyId,
    memberIds: memberIds.length,
    startDate: format(startDate, 'yyyy-MM-dd'),
    endDate: format(endDate, 'yyyy-MM-dd'),
    numberOfWeeks,
    calculatedDayRange: Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
  });

  // DEBUG: Log specific date for troubleshooting (using correct 2025 date)
  const targetWeek = '2025-07-14'; // Week 29 start date (Monday) - 2025 data
  console.log('🔍 TARGET WEEK DEBUG:', {
    targetWeek,
    isInRange: targetWeek >= format(startDate, 'yyyy-MM-dd') && targetWeek <= format(endDate, 'yyyy-MM-dd'),
    numberOfWeeks,
    viewType: numberOfWeeks === 12 ? '12-week' : numberOfWeeks === 24 ? '24-week' : `${numberOfWeeks}-week`,
    dateRange: `${format(startDate, 'yyyy-MM-dd')} to ${format(endDate, 'yyyy-MM-dd')}`
  });

  // Fetch ALL allocations within the date range (not just specific week_start_dates)
  // This ensures we capture the full week data (Sunday to Saturday)
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
    .lte('week_start_date', format(endDate, 'yyyy-MM-dd'))
    .gt('hours', 0);

  if (error) {
    console.error('🔍 PROJECT ALLOCATIONS: Error fetching project allocations:', error);
    throw error;
  }

  console.log('🔍 PROJECT ALLOCATIONS: Fetched allocations (using Project Resourcing logic):', data?.length || 0);
  
  // DEBUG: Log Rob Night's data specifically (updated for 2025)
  const robNightId = 'fc351fa0-b6df-447a-bc27-b6675db2622e'; // Rob Night's ID from logs
  const robData = data?.filter(d => 
    d.resource_id === robNightId || 
    (d.week_start_date === '2025-07-14' && d.hours > 0)
  ) || [];
  console.log('🔍 ROB NIGHT DEBUG: Found allocations for Rob Night in 2025-07-14:', robData);
  console.log('🔍 ROB NIGHT DEBUG: All Rob Night allocations:', data?.filter(d => d.resource_id === robNightId));
  
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
    const hours = parseFloat(allocation.hours) || 0;
    const projectId = allocation.project_id;
    
    // Convert the allocation's week_start_date to the Monday of that week (in case data is inconsistent)
    // The allocation date might be any day in the week, so normalize to Monday
    const allocationDate = parseISO(allocation.week_start_date);
    const allocationWeekStart = startOfWeek(allocationDate, { weekStartsOn: 1 }); // Monday as week start
    const weekKey = format(allocationWeekStart, 'yyyy-MM-dd');
    
    // DEBUG: Log the week normalization
    if (memberId === 'fc351fa0-b6df-447a-bc27-b6675db2622e') {
      console.log(`🔍 ROB WEEK NORMALIZATION: Original: ${allocation.week_start_date} -> Normalized: ${weekKey}`);
    }

    console.log(`🔍 PROCESSING ALLOCATION: Member ${memberId}, Original Date: ${allocation.week_start_date}, Normalized Week: ${weekKey}, Hours ${hours}, Project ${allocation.projects?.name || 'Unknown'}`);

    // Initialize nested maps if needed
    if (!memberWeekHours.has(memberId)) {
      memberWeekHours.set(memberId, new Map());
      memberWeekProjects.set(memberId, new Map());
    }
    if (!memberWeekProjects.get(memberId)!.has(weekKey)) {
      memberWeekProjects.get(memberId)!.set(weekKey, new Map());
    }

    // Aggregate hours for this week
    const currentHours = memberWeekHours.get(memberId)!.get(weekKey) || 0;
    const newTotal = currentHours + hours;
    memberWeekHours.get(memberId)!.set(weekKey, newTotal);
    
    console.log(`🔍 WEEK AGGREGATION: Member ${memberId}, Week ${weekKey}, Current: ${currentHours}h, Adding: ${hours}h, New Total: ${newTotal}h`);

    // Aggregate projects for this week
    const projectsMap = memberWeekProjects.get(memberId)!.get(weekKey)!;
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
      
      console.log(`🔍 FINAL RESULT: Member ${memberId}, Week ${weekKey}, Total Hours: ${breakdown.total} (Project: ${breakdown.projectHours}, Projects: ${breakdown.projects.length})`);
    });
  });

  console.log('🔍 PROCESSING: Finished processing project allocations for', memberWeekHours.size, 'members');
};
