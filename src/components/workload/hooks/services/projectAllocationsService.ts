
import { supabase } from '@/integrations/supabase/client';
import { format, startOfWeek, addWeeks } from 'date-fns';
import { ProjectAllocation, WorkloadDataParams } from '../types';

export const fetchProjectAllocations = async (params: WorkloadDataParams) => {
  const { companyId, memberIds, startDate, numberOfWeeks } = params;

  // Generate week start dates
  const weekStartDates = [];
  for (let i = 0; i < numberOfWeeks; i++) {
    const weekStart = startOfWeek(addWeeks(startDate, i), { weekStartsOn: 1 });
    weekStartDates.push(format(weekStart, 'yyyy-MM-dd'));
  }

  console.log('Fetching project allocations for:', {
    companyId,
    memberIds: memberIds.length,
    weekStartDates: weekStartDates.length
  });

  // Get project allocations with project details
  const { data: allocations, error } = await supabase
    .from('project_resource_allocations')
    .select(`
      resource_id,
      project_id,
      hours,
      week_start_date,
      projects:project_id (
        id,
        name,
        code
      )
    `)
    .eq('company_id', companyId)
    .in('resource_id', memberIds)
    .in('week_start_date', weekStartDates);

  if (error) {
    console.error('Error fetching project allocations:', error);
    throw error;
  }

  console.log('Fetched project allocations:', allocations?.length || 0);
  return allocations || [];
};

export const processProjectAllocations = (
  allocations: any[],
  result: Record<string, Record<string, any>>
) => {
  allocations.forEach(allocation => {
    const memberId = allocation.resource_id;
    const weekKey = allocation.week_start_date;
    const hours = allocation.hours || 0;
    
    if (result[memberId] && result[memberId][weekKey]) {
      result[memberId][weekKey].projectHours += hours;
      result[memberId][weekKey].total += hours;
      
      // Add project details
      if (allocation.projects && hours > 0) {
        const project: ProjectAllocation = {
          project_id: allocation.project_id,
          project_name: allocation.projects.name || 'Unknown Project',
          project_code: allocation.projects.code || 'Unknown Code',
          hours: hours
        };
        
        // Check if project already exists and sum hours
        const existingProjectIndex = result[memberId][weekKey].projects.findIndex(
          (p: ProjectAllocation) => p.project_id === project.project_id
        );
        
        if (existingProjectIndex >= 0) {
          result[memberId][weekKey].projects[existingProjectIndex].hours += hours;
        } else {
          result[memberId][weekKey].projects.push(project);
        }
      }
    }
  });
};
