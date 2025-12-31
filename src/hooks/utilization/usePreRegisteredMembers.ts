
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { TeamMember } from '@/components/dashboard/types';
import { calculatePeriodUtilization, getUtilizationPeriods } from './utils';
import { IndividualUtilization } from './types';
import { logger } from '@/utils/logger';

export const calculatePreRegisteredUtilizations = async (
  preRegisteredMembers: TeamMember[],
  companyId: string,
  currentWeekStart: Date,
  ninetyDaysAgo: Date,
  workWeekHours: number
): Promise<Record<string, IndividualUtilization>> => {
  const utilizationMap: Record<string, IndividualUtilization> = {};
  
  if (preRegisteredMembers.length === 0) {
    return utilizationMap;
  }

  const preRegisteredIds = preRegisteredMembers.map(member => member.id);
  
  logger.log('Fetching allocations for pre-registered member IDs:', preRegisteredIds);
  
  const { data: preRegAllocations, error: preRegError } = await supabase
    .from('project_resource_allocations')
    .select('resource_id, hours, allocation_date, project_id, resource_type')
    .eq('company_id', companyId)
    .eq('resource_type', 'pre_registered')
    .in('resource_id', preRegisteredIds)
    .gte('allocation_date', format(ninetyDaysAgo, 'yyyy-MM-dd'))
    .lte('allocation_date', format(currentWeekStart, 'yyyy-MM-dd'));

  if (preRegError) throw preRegError;

  logger.log('Pre-registered allocations fetched:', preRegAllocations?.length || 0);
  logger.log('Pre-registered allocations data:', preRegAllocations);

  // Calculate utilization for pre-registered members
  preRegisteredMembers.forEach(member => {
    const memberCapacity = member.weekly_capacity || workWeekHours;
    
    logger.log(`--- Pre-registered Member ${member.first_name} ${member.last_name} (${member.id}) (Capacity: ${memberCapacity}h/week) ---`);

    const memberAllocations = preRegAllocations?.filter(allocation => 
      allocation.resource_id === member.id
    ) || [];
    
    logger.log(`Member allocations found: ${memberAllocations.length}`);
    logger.log(`Member allocations data:`, memberAllocations);

    if (memberAllocations.length > 0) {
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
    } else {
      // Initialize with zeros if no allocations found
      utilizationMap[member.id] = {
        memberId: member.id,
        days7: 0,
        days30: 0,
        days90: 0
      };
    }
  });

  return utilizationMap;
};
