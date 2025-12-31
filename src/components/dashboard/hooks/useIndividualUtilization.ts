
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { useAppSettings } from '@/hooks/useAppSettings';
import { format, startOfWeek, startOfMonth, subMonths, endOfWeek, endOfMonth } from 'date-fns';
import { TimeRange } from '../TimeRangeSelector';
import { logger } from '@/utils/logger';

interface TeamMember {
  id: string;
  first_name?: string;
  last_name?: string;
  weekly_capacity?: number;
  isPending?: boolean;
}

export const useIndividualUtilization = (teamMembers: TeamMember[], selectedTimeRange: TimeRange) => {
  const [memberUtilizations, setMemberUtilizations] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const { company } = useCompany();
  const { workWeekHours } = useAppSettings();

  // Calculate date range based on selected time range
  const getDateRange = () => {
    const now = new Date();
    let startDate: Date;
    let endDate: Date;
    
    switch (selectedTimeRange) {
      case 'week':
        startDate = startOfWeek(now, { weekStartsOn: 1 });
        endDate = endOfWeek(now, { weekStartsOn: 1 });
        break;
      case 'month':
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
        break;
      case '3months':
        startDate = subMonths(startOfMonth(now), 3);
        endDate = endOfMonth(now);
        break;
      default:
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
    }
    
    return {
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd')
    };
  };

  // Calculate total capacity based on time range
  const getTotalCapacity = (weeklyCapacity: number) => {
    switch (selectedTimeRange) {
      case 'week':
        return weeklyCapacity;
      case 'month':
        return weeklyCapacity * 4;
      case '3months':
        return weeklyCapacity * 12;
      default:
        return weeklyCapacity * 4;
    }
  };

  useEffect(() => {
    const calculateUtilizations = async () => {
      if (!company?.id || !teamMembers?.length) {
        logger.debug('No company or team members available for utilization calculation');
        setIsLoading(false);
        return;
      }

      logger.debug('=== INDIVIDUAL UTILIZATION CALCULATION ===');
      logger.debug('Company ID:', company.id);
      logger.debug('Team members to calculate utilization for:', teamMembers.length);
      logger.debug('Selected time range:', selectedTimeRange);

      try {
        const utilizations: Record<string, number> = {};
        const { startDate, endDate } = getDateRange();
        
        logger.debug('Calculating utilization for period:', startDate, 'to', endDate);

        for (const member of teamMembers) {
          const memberName = `${member.first_name || ''} ${member.last_name || ''}`.trim();
          logger.debug(`\n--- Processing member: ${memberName} (ID: ${member.id}) ---`);
          logger.debug('Is pending:', member.isPending);
          logger.debug('Selected time range:', selectedTimeRange);
          
          let totalAllocatedHours = 0;
          
          if (member.isPending) {
            // For pre-registered members, check pending_resources and their allocations
            logger.debug('Checking pending resources allocations...');
            
            const { data: allocations, error } = await supabase
              .from('project_resource_allocations')
              .select('hours')
              .eq('resource_id', member.id)
              .eq('resource_type', 'pre_registered')
              .eq('company_id', company.id)
              .gte('allocation_date', startDate)
              .lte('allocation_date', endDate);

            if (error) {
              console.error(`Error fetching allocations for pending member ${memberName}:`, error);
            } else {
              totalAllocatedHours = allocations?.reduce((sum, allocation) => sum + (allocation.hours || 0), 0) || 0;
              logger.debug(`Pending member ${memberName} allocations:`, allocations);
              logger.debug(`Total allocated hours for period: ${totalAllocatedHours}`);
            }
          } else {
            // For active members, check project_resources and their allocations
            logger.debug('Checking active member allocations...');
            
            const { data: allocations, error } = await supabase
              .from('project_resource_allocations')
              .select('hours')
              .eq('resource_id', member.id)
              .eq('resource_type', 'active')
              .eq('company_id', company.id)
              .gte('allocation_date', startDate)
              .lte('allocation_date', endDate);

            if (error) {
              console.error(`Error fetching allocations for active member ${memberName}:`, error);
            } else {
              totalAllocatedHours = allocations?.reduce((sum, allocation) => sum + (allocation.hours || 0), 0) || 0;
              logger.debug(`Active member ${memberName} allocations:`, allocations);
              logger.debug(`Total allocated hours for period: ${totalAllocatedHours}`);
            }
          }

          // Calculate utilization percentage based on time range capacity
          const weeklyCapacity = member.weekly_capacity || workWeekHours;
          const totalCapacityForPeriod = getTotalCapacity(weeklyCapacity);
          const utilization = totalCapacityForPeriod > 0 ? (totalAllocatedHours / totalCapacityForPeriod) * 100 : 0;
          
          logger.debug(`Member ${memberName} (${selectedTimeRange}):`);
          logger.debug(`- Weekly capacity: ${weeklyCapacity} hours`);
          logger.debug(`- Total capacity for period: ${totalCapacityForPeriod} hours`);
          logger.debug(`- Total allocated: ${totalAllocatedHours} hours`);
          logger.debug(`- Utilization: ${utilization.toFixed(1)}%`);
          
          utilizations[member.id] = Math.round(utilization);
        }

        console.log('\n=== FINAL UTILIZATIONS FOR', selectedTimeRange.toUpperCase(), '===');
        Object.entries(utilizations).forEach(([id, util]) => {
          const member = teamMembers.find(m => m.id === id);
          const name = `${member?.first_name || ''} ${member?.last_name || ''}`.trim();
          console.log(`${name}: ${util}%`);
        });
        console.log('=== END UTILIZATION CALCULATION ===');

        setMemberUtilizations(utilizations);
      } catch (error) {
        console.error('Error calculating individual utilizations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    calculateUtilizations();
  }, [teamMembers, company?.id, selectedTimeRange]);

  return {
    memberUtilizations,
    isLoading
  };
};
