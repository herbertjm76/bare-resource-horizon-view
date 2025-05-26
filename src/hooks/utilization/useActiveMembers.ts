
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { TeamMember } from '@/components/dashboard/types';
import { calculatePeriodUtilization, getUtilizationPeriods } from './utils';
import { IndividualUtilization } from './types';

export const calculateActiveUtilizations = async (
  activeMembers: TeamMember[],
  companyId: string,
  currentWeekStart: Date,
  ninetyDaysAgo: Date
): Promise<Record<string, IndividualUtilization>> => {
  const utilizationMap: Record<string, IndividualUtilization> = {};
  
  if (activeMembers.length === 0) {
    return utilizationMap;
  }

  const activeMemberIds = activeMembers.map(member => member.id);
  
  console.log('Fetching allocations for active member IDs:', activeMemberIds);
  
  // Fetch allocations for active members
  const { data: activeAllocations, error: activeError } = await supabase
    .from('project_resource_allocations')
    .select('resource_id, hours, week_start_date, project_id, resource_type')
    .eq('company_id', companyId)
    .eq('resource_type', 'active')
    .in('resource_id', activeMemberIds)
    .gte('week_start_date', format(ninetyDaysAgo, 'yyyy-MM-dd'))
    .lte('week_start_date', format(currentWeekStart, 'yyyy-MM-dd'));

  if (activeError) throw activeError;

  console.log('Active allocations fetched:', activeAllocations?.length || 0);
  console.log('Active allocations data:', activeAllocations);

  // Calculate utilization for active members
  activeMembers.forEach(member => {
    const memberCapacity = member.weekly_capacity || 40;
    
    console.log(`--- Active Member ${member.first_name} ${member.last_name} (${member.id}) (Capacity: ${memberCapacity}h/week) ---`);

    // Get allocations for this specific member
    const memberAllocations = activeAllocations?.filter(allocation => 
      allocation.resource_id === member.id
    ) || [];
    
    console.log(`Member allocations found: ${memberAllocations.length}`);
    console.log(`Member allocations data:`, memberAllocations);

    const periods = getUtilizationPeriods(currentWeekStart);
    
    utilizationMap[member.id] = {
      memberId: member.id,
      days7: calculatePeriodUtilization(
        periods.days7.startDate,
        currentWeekStart,
        periods.days7.periodName,
        memberAllocations,
        memberCapacity,
        member.id,
        `${member.first_name} ${member.last_name}`
      ),
      days30: calculatePeriodUtilization(
        periods.days30.startDate,
        currentWeekStart,
        periods.days30.periodName,
        memberAllocations,
        memberCapacity,
        member.id,
        `${member.first_name} ${member.last_name}`
      ),
      days90: calculatePeriodUtilization(
        periods.days90.startDate,
        currentWeekStart,
        periods.days90.periodName,
        memberAllocations,
        memberCapacity,
        member.id,
        `${member.first_name} ${member.last_name}`
      )
    };
  });

  return utilizationMap;
};
