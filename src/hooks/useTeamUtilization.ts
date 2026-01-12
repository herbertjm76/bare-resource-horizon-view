
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCompanyId } from '@/hooks/useCompanyId';
import { useAppSettings } from '@/hooks/useAppSettings';
import { getMemberCapacity } from '@/utils/capacityUtils';
import { format, startOfWeek, subWeeks, eachWeekOfInterval } from 'date-fns';
import { logger } from '@/utils/logger';
import type { Profile } from '@/context/types';

interface UtilizationData {
  days7: number;
  days30: number;
  days90: number;
}

interface TeamMemberWithCapacity extends Pick<Profile, 'id' | 'weekly_capacity'> {}

interface AllocationRecord {
  resource_id: string;
  hours: number;
  allocation_date: string;
  project_id: string;
}

export const useTeamUtilization = (teamMembers: TeamMemberWithCapacity[]) => {
  const [utilization, setUtilization] = useState<UtilizationData>({
    days7: 0,
    days30: 0,
    days90: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const { companyId } = useCompanyId();
  const { workWeekHours } = useAppSettings();

  useEffect(() => {
    if (!companyId || teamMembers.length === 0) {
      setIsLoading(false);
      return;
    }

    const fetchUtilization = async () => {
      setIsLoading(true);
      
      try {
        const now = new Date();
        const currentWeekStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday
        const thirtyDaysAgo = subWeeks(currentWeekStart, 4);
        const ninetyDaysAgo = subWeeks(currentWeekStart, 12);
        
        const memberIds = teamMembers.map(member => member.id);
        
        logger.log('=== UTILIZATION CALCULATION DEBUG ===');
        logger.log('Current date:', format(now, 'yyyy-MM-dd'));
        logger.log('Current week start (Monday):', format(currentWeekStart, 'yyyy-MM-dd'));
        logger.log('30 days ago week start:', format(thirtyDaysAgo, 'yyyy-MM-dd'));
        logger.log('90 days ago week start:', format(ninetyDaysAgo, 'yyyy-MM-dd'));
        logger.log('Team member IDs:', memberIds);
        
        // Fetch allocations for the past 90 days - we need to get from project_resource_allocations
        // which stores weekly allocations, not daily ones
        // RULEBOOK: ALL allocation reads include both active and pre_registered
        const { data: allocations, error } = await supabase
          .from('project_resource_allocations')
          .select('resource_id, hours, allocation_date, project_id')
          .eq('company_id', companyId)
          .in('resource_type', ['active', 'pre_registered'])
          .in('resource_id', memberIds)
          .gte('allocation_date', format(ninetyDaysAgo, 'yyyy-MM-dd'))
          .lte('allocation_date', format(currentWeekStart, 'yyyy-MM-dd'));

        if (error) throw error;

        const typedAllocations = (allocations || []) as AllocationRecord[];
        
        logger.log('Raw allocations fetched:', typedAllocations.length);
        logger.log('Allocations data:', typedAllocations);

        // Calculate total capacity for each period
        const totalWeeklyCapacity = teamMembers.reduce((sum, member) => 
          sum + getMemberCapacity(member.weekly_capacity ?? null, workWeekHours), 0
        );
        
        logger.log('Total weekly capacity:', totalWeeklyCapacity);

        // Calculate utilization for different periods
        const calculatePeriodUtilization = (startDate: Date, periodName: string): number => {
          // Get all weeks in the period
          const weeks = eachWeekOfInterval(
            { start: startDate, end: currentWeekStart },
            { weekStartsOn: 1 }
          );
          
          logger.log(`--- ${periodName} Period ---`);
          logger.log(`Period start: ${format(startDate, 'yyyy-MM-dd')}`);
          logger.log(`Period end: ${format(currentWeekStart, 'yyyy-MM-dd')}`);
          logger.log(`Weeks in period: ${weeks.length}`);
          
          let totalAllocatedHours = 0;
          
          // For each week, sum up all allocations
          weeks.forEach(weekStart => {
            const weekKey = format(weekStart, 'yyyy-MM-dd');
            const weekAllocations = typedAllocations.filter(allocation => 
              allocation.allocation_date === weekKey
            );
            
            const weekHours = weekAllocations.reduce((sum, allocation) => {
              logger.log(`Week ${weekKey}: ${allocation.resource_id} - ${allocation.hours}h (project: ${allocation.project_id})`);
              return sum + (allocation.hours || 0);
            }, 0);
            
            totalAllocatedHours += weekHours;
            logger.log(`Week ${weekKey} total hours: ${weekHours}`);
          });
          
          const totalCapacity = totalWeeklyCapacity * weeks.length;
          
          logger.log(`Total allocated hours in period: ${totalAllocatedHours}`);
          logger.log(`Total capacity in period: ${totalCapacity}`);
          
          const utilizationPercentage = totalCapacity > 0 ? Math.round((totalAllocatedHours / totalCapacity) * 100) : 0;
          logger.log(`${periodName} utilization: ${utilizationPercentage}%`);
          
          return utilizationPercentage;
        };

        const utilizationData: UtilizationData = {
          days7: calculatePeriodUtilization(currentWeekStart, '7-day (current week)'),
          days30: calculatePeriodUtilization(thirtyDaysAgo, '30-day'),
          days90: calculatePeriodUtilization(ninetyDaysAgo, '90-day')
        };

        logger.log('Final calculated utilization:', utilizationData);
        logger.log('=== END DEBUG ===');
        
        setUtilization(utilizationData);
      } catch (error) {
        logger.error('Error calculating team utilization:', error);
        setUtilization({ days7: 0, days30: 0, days90: 0 });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUtilization();
  }, [companyId, teamMembers, workWeekHours]);

  return { utilization, isLoading };
};
