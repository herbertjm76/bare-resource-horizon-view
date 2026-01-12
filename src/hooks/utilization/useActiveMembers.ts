
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { TeamMember } from '@/components/dashboard/types';
import { calculatePeriodUtilization, getUtilizationPeriods } from './utils';
import { IndividualUtilization } from './types';
import { logger } from '@/utils/logger';

export const calculateActiveUtilizations = async (
  activeMembers: TeamMember[],
  companyId: string,
  currentWeekStart: Date,
  ninetyDaysAgo: Date,
  workWeekHours: number
): Promise<Record<string, IndividualUtilization>> => {
  const utilizationMap: Record<string, IndividualUtilization> = {};
  
  if (activeMembers.length === 0) {
    return utilizationMap;
  }

  const activeMemberIds = activeMembers.map(member => member.id);
  
  logger.log('Fetching allocations for active member IDs:', activeMemberIds);
  
  // Fetch allocations for active members
  // RULEBOOK: ALL allocation reads include both active and pre_registered
  const { data: activeAllocations, error: activeError } = await supabase
    .from('project_resource_allocations')
    .select('resource_id, hours, allocation_date, project_id, resource_type')
    .eq('company_id', companyId)
    .in('resource_type', ['active', 'pre_registered'])
    .in('resource_id', activeMemberIds)
    .gte('allocation_date', format(ninetyDaysAgo, 'yyyy-MM-dd'))
    .lte('allocation_date', format(currentWeekStart, 'yyyy-MM-dd'));

  if (activeError) throw activeError;

  logger.log('Active allocations fetched:', activeAllocations?.length || 0);
  logger.log('Active allocations data:', activeAllocations);

  // Calculate utilization for active members
  activeMembers.forEach(member => {
    const memberCapacity = member.weekly_capacity || workWeekHours;
    
    logger.log(`--- Active Member ${member.first_name} ${member.last_name} (${member.id}) (Capacity: ${memberCapacity}h/week) ---`);

    // Get allocations for this specific member
    const memberAllocations = activeAllocations?.filter(allocation => 
      allocation.resource_id === member.id
    ) || [];
    
    logger.log(`Member allocations found: ${memberAllocations.length}`);
    logger.log(`Member allocations data:`, memberAllocations);

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
