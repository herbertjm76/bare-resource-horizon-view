
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { format, startOfWeek, subWeeks, addDays, eachWeekOfInterval } from 'date-fns';

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
        const currentWeekStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday
        const thirtyDaysAgo = subWeeks(currentWeekStart, 4);
        const ninetyDaysAgo = subWeeks(currentWeekStart, 12);
        
        const memberIds = teamMembers.map(member => member.id);
        
        console.log('=== UTILIZATION CALCULATION DEBUG ===');
        console.log('Current date:', format(now, 'yyyy-MM-dd'));
        console.log('Current week start (Monday):', format(currentWeekStart, 'yyyy-MM-dd'));
        console.log('30 days ago week start:', format(thirtyDaysAgo, 'yyyy-MM-dd'));
        console.log('90 days ago week start:', format(ninetyDaysAgo, 'yyyy-MM-dd'));
        console.log('Team member IDs:', memberIds);
        
        // Fetch allocations for the past 90 days - we need to get from project_resource_allocations
        // which stores weekly allocations, not daily ones
        const { data: allocations, error } = await supabase
          .from('project_resource_allocations')
          .select('resource_id, hours, week_start_date, project_id')
          .eq('company_id', company.id)
          .eq('resource_type', 'active')
          .in('resource_id', memberIds)
          .gte('week_start_date', format(ninetyDaysAgo, 'yyyy-MM-dd'))
          .lte('week_start_date', format(currentWeekStart, 'yyyy-MM-dd'));

        if (error) throw error;

        console.log('Raw allocations fetched:', allocations?.length || 0);
        console.log('Allocations data:', allocations);

        // Calculate total capacity for each period
        const totalWeeklyCapacity = teamMembers.reduce((sum, member) => 
          sum + (member.weekly_capacity || 40), 0
        );
        
        console.log('Total weekly capacity:', totalWeeklyCapacity);

        // Calculate utilization for different periods
        const calculatePeriodUtilization = (startDate: Date, periodName: string) => {
          // Get all weeks in the period
          const weeks = eachWeekOfInterval(
            { start: startDate, end: currentWeekStart },
            { weekStartsOn: 1 }
          );
          
          console.log(`--- ${periodName} Period ---`);
          console.log(`Period start: ${format(startDate, 'yyyy-MM-dd')}`);
          console.log(`Period end: ${format(currentWeekStart, 'yyyy-MM-dd')}`);
          console.log(`Weeks in period: ${weeks.length}`);
          
          let totalAllocatedHours = 0;
          
          // For each week, sum up all allocations
          weeks.forEach(weekStart => {
            const weekKey = format(weekStart, 'yyyy-MM-dd');
            const weekAllocations = allocations?.filter(allocation => 
              allocation.week_start_date === weekKey
            ) || [];
            
            const weekHours = weekAllocations.reduce((sum, allocation) => {
              console.log(`Week ${weekKey}: ${allocation.resource_id} - ${allocation.hours}h (project: ${allocation.project_id})`);
              return sum + (allocation.hours || 0);
            }, 0);
            
            totalAllocatedHours += weekHours;
            console.log(`Week ${weekKey} total hours: ${weekHours}`);
          });
          
          const totalCapacity = totalWeeklyCapacity * weeks.length;
          
          console.log(`Total allocated hours in period: ${totalAllocatedHours}`);
          console.log(`Total capacity in period: ${totalCapacity}`);
          
          const utilizationPercentage = totalCapacity > 0 ? Math.round((totalAllocatedHours / totalCapacity) * 100) : 0;
          console.log(`${periodName} utilization: ${utilizationPercentage}%`);
          
          return utilizationPercentage;
        };

        const utilizationData = {
          days7: calculatePeriodUtilization(currentWeekStart, '7-day (current week)'),
          days30: calculatePeriodUtilization(thirtyDaysAgo, '30-day'),
          days90: calculatePeriodUtilization(ninetyDaysAgo, '90-day')
        };

        console.log('Final calculated utilization:', utilizationData);
        console.log('=== END DEBUG ===');
        
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
