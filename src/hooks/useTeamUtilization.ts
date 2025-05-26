
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { format, startOfWeek, subWeeks } from 'date-fns';

interface UtilizationData {
  days7: number;
  days30: number;
  days90: number;
}

export const useTeamUtilization = (teamMembers: any[]) => {
  const [utilization, setUtilization] = useState<UtilizationData>({
    days7: 0,
    days30: 0,
    days90: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const { company } = useCompany();

  useEffect(() => {
    if (!company?.id || teamMembers.length === 0) {
      setIsLoading(false);
      return;
    }

    const fetchUtilization = async () => {
      setIsLoading(true);
      
      try {
        const now = new Date();
        const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday
        const thirtyDaysAgo = subWeeks(weekStart, 4);
        const ninetyDaysAgo = subWeeks(weekStart, 12);
        
        const memberIds = teamMembers.map(member => member.id);
        
        // Fetch allocations for the past 90 days
        const { data: allocations, error } = await supabase
          .from('project_resource_allocations')
          .select('resource_id, hours, week_start_date')
          .eq('company_id', company.id)
          .eq('resource_type', 'active')
          .in('resource_id', memberIds)
          .gte('week_start_date', format(ninetyDaysAgo, 'yyyy-MM-dd'))
          .lte('week_start_date', format(weekStart, 'yyyy-MM-dd'));

        if (error) throw error;

        // Calculate total capacity for each period
        const totalWeeklyCapacity = teamMembers.reduce((sum, member) => 
          sum + (member.weekly_capacity || 40), 0
        );

        // Calculate utilization for different periods
        const calculatePeriodUtilization = (startDate: Date) => {
          const periodAllocations = allocations?.filter(allocation => 
            new Date(allocation.week_start_date) >= startDate
          ) || [];
          
          const totalAllocatedHours = periodAllocations.reduce((sum, allocation) => 
            sum + (allocation.hours || 0), 0
          );
          
          const weeksInPeriod = Math.ceil((weekStart.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
          const totalCapacity = totalWeeklyCapacity * weeksInPeriod;
          
          return totalCapacity > 0 ? Math.round((totalAllocatedHours / totalCapacity) * 100) : 0;
        };

        const utilizationData = {
          days7: calculatePeriodUtilization(weekStart),
          days30: calculatePeriodUtilization(thirtyDaysAgo),
          days90: calculatePeriodUtilization(ninetyDaysAgo)
        };

        console.log('Calculated utilization:', utilizationData);
        console.log('Team members:', teamMembers.length);
        console.log('Total allocations found:', allocations?.length || 0);
        
        setUtilization(utilizationData);
      } catch (error) {
        console.error('Error calculating team utilization:', error);
        setUtilization({ days7: 0, days30: 0, days90: 0 });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUtilization();
  }, [company?.id, teamMembers]);

  return { utilization, isLoading };
};
