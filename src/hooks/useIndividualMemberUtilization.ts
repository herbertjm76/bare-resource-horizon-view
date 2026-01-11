
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { useAppSettings } from '@/hooks/useAppSettings';
import { format, startOfWeek, subWeeks } from 'date-fns';
import { logger } from '@/utils/logger';

interface IndividualUtilization {
  days7: number;
  days30: number;
  days90: number;
}

export const useIndividualMemberUtilization = (memberId: string, weeklyCapacity?: number) => {
  const [utilization, setUtilization] = useState<IndividualUtilization>({
    days7: 0,
    days30: 0,
    days90: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const { company } = useCompany();
  const { workWeekHours } = useAppSettings();

  const effectiveWeeklyCapacity = weeklyCapacity ?? workWeekHours;

  useEffect(() => {
    const fetchUtilization = async () => {
      if (!company?.id || !memberId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        const now = new Date();
        const currentWeekStart = startOfWeek(now, { weekStartsOn: 1 });
        const fourWeeksAgo = subWeeks(currentWeekStart, 4);
        const twelveWeeksAgo = subWeeks(currentWeekStart, 12);
        
        logger.log('Fetching utilization for member:', memberId);
        logger.log('Weekly capacity:', effectiveWeeklyCapacity);
        
        // Fetch allocations for the past 90 days in one query
        // RULEBOOK: Filter by resource_type='active' for active member views
        const { data: allocations, error } = await supabase
          .from('project_resource_allocations')
          .select('hours, allocation_date')
          .eq('resource_id', memberId)
          .eq('company_id', company.id)
          .eq('resource_type', 'active')
          .gte('allocation_date', format(twelveWeeksAgo, 'yyyy-MM-dd'))
          .lte('allocation_date', format(currentWeekStart, 'yyyy-MM-dd'));

        if (error) {
          logger.error('Error fetching allocations:', error);
          throw error;
        }

        logger.log('Allocations fetched:', allocations?.length || 0);

        // Calculate utilization for different periods
        const calculatePeriodUtilization = (weeksBack: number) => {
          const periodStart = subWeeks(currentWeekStart, weeksBack);
          const periodAllocations = allocations?.filter(allocation => 
            allocation.allocation_date >= format(periodStart, 'yyyy-MM-dd')
          ) || [];
          
          const totalHours = periodAllocations.reduce((sum, allocation) => 
            sum + (allocation.hours || 0), 0
          );
          
          const totalCapacity = effectiveWeeklyCapacity * weeksBack;
          return totalCapacity > 0 ? Math.round((totalHours / totalCapacity) * 100) : 0;
        };

        const utilizationData = {
          days7: calculatePeriodUtilization(1), // Current week
          days30: calculatePeriodUtilization(4), // Last 4 weeks
          days90: calculatePeriodUtilization(12) // Last 12 weeks
        };

        logger.log('Calculated utilization:', utilizationData);
        setUtilization(utilizationData);
      } catch (error) {
        logger.error('Error calculating utilization:', error);
        setUtilization({ days7: 0, days30: 0, days90: 0 });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUtilization();
  }, [company?.id, memberId, effectiveWeeklyCapacity, workWeekHours]);

  return { utilization, isLoading };
};
