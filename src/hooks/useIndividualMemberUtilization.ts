
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { format, startOfWeek, subWeeks, endOfWeek } from 'date-fns';

interface IndividualUtilization {
  days7: number;
  days30: number;
  days90: number;
}

export const useIndividualMemberUtilization = (memberId: string, weeklyCapacity: number = 40) => {
  const [utilization, setUtilization] = useState<IndividualUtilization>({
    days7: 0,
    days30: 0,
    days90: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const { company } = useCompany();

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
        
        console.log('Fetching utilization for member:', memberId);
        console.log('Weekly capacity:', weeklyCapacity);
        
        // Fetch allocations for the past 90 days in one query
        const { data: allocations, error } = await supabase
          .from('project_resource_allocations')
          .select('hours, week_start_date')
          .eq('resource_id', memberId)
          .eq('company_id', company.id)
          .gte('week_start_date', format(twelveWeeksAgo, 'yyyy-MM-dd'))
          .lte('week_start_date', format(currentWeekStart, 'yyyy-MM-dd'));

        if (error) {
          console.error('Error fetching allocations:', error);
          throw error;
        }

        console.log('Allocations fetched:', allocations?.length || 0);

        // Calculate utilization for different periods
        const calculatePeriodUtilization = (weeksBack: number) => {
          const periodStart = subWeeks(currentWeekStart, weeksBack);
          const periodAllocations = allocations?.filter(allocation => 
            allocation.week_start_date >= format(periodStart, 'yyyy-MM-dd')
          ) || [];
          
          const totalHours = periodAllocations.reduce((sum, allocation) => 
            sum + (allocation.hours || 0), 0
          );
          
          const totalCapacity = weeklyCapacity * weeksBack;
          return totalCapacity > 0 ? Math.round((totalHours / totalCapacity) * 100) : 0;
        };

        const utilizationData = {
          days7: calculatePeriodUtilization(1), // Current week
          days30: calculatePeriodUtilization(4), // Last 4 weeks
          days90: calculatePeriodUtilization(12) // Last 12 weeks
        };

        console.log('Calculated utilization:', utilizationData);
        setUtilization(utilizationData);
      } catch (error) {
        console.error('Error calculating utilization:', error);
        setUtilization({ days7: 0, days30: 0, days90: 0 });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUtilization();
  }, [company?.id, memberId, weeklyCapacity]);

  return { utilization, isLoading };
};
