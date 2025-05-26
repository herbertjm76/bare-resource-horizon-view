
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { format, startOfWeek, subWeeks, eachWeekOfInterval } from 'date-fns';
import { TeamMember } from '@/components/dashboard/types';

interface IndividualUtilization {
  memberId: string;
  days7: number;
  days30: number;
  days90: number;
}

export const useIndividualUtilization = (teamMembers: TeamMember[]) => {
  const [individualUtilizations, setIndividualUtilizations] = useState<Record<string, IndividualUtilization>>({});
  const [isLoading, setIsLoading] = useState(true);
  const { company } = useCompany();

  const memberIds = useMemo(() => teamMembers.map(member => member.id), [teamMembers]);

  useEffect(() => {
    if (!company?.id || memberIds.length === 0) {
      setIsLoading(false);
      return;
    }

    const fetchIndividualUtilizations = async () => {
      setIsLoading(true);
      
      try {
        const now = new Date();
        const currentWeekStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday
        const thirtyDaysAgo = subWeeks(currentWeekStart, 4);
        const ninetyDaysAgo = subWeeks(currentWeekStart, 12);
        
        console.log('=== INDIVIDUAL UTILIZATION CALCULATION ===');
        console.log('Current week start (Monday):', format(currentWeekStart, 'yyyy-MM-dd'));
        console.log('30 days ago week start:', format(thirtyDaysAgo, 'yyyy-MM-dd'));
        console.log('90 days ago week start:', format(ninetyDaysAgo, 'yyyy-MM-dd'));
        console.log('Member IDs:', memberIds);
        
        // Fetch allocations for all members for the past 90 days
        const { data: allocations, error } = await supabase
          .from('project_resource_allocations')
          .select('resource_id, hours, week_start_date, project_id')
          .eq('company_id', company.id)
          .eq('resource_type', 'active')
          .in('resource_id', memberIds)
          .gte('week_start_date', format(ninetyDaysAgo, 'yyyy-MM-dd'))
          .lte('week_start_date', format(currentWeekStart, 'yyyy-MM-dd'));

        if (error) throw error;

        console.log('Individual allocations fetched:', allocations?.length || 0);

        const utilizationMap: Record<string, IndividualUtilization> = {};

        // Initialize utilization data for all members
        memberIds.forEach(memberId => {
          utilizationMap[memberId] = {
            memberId,
            days7: 0,
            days30: 0,
            days90: 0
          };
        });

        // Calculate utilization for each member
        memberIds.forEach(memberId => {
          const member = teamMembers.find(m => m.id === memberId);
          const memberCapacity = member?.weekly_capacity || 40;
          
          console.log(`--- Member ${memberId} (Capacity: ${memberCapacity}h/week) ---`);

          // Calculate for different periods
          const calculatePeriodUtilization = (startDate: Date, periodName: string) => {
            const weeks = eachWeekOfInterval(
              { start: startDate, end: currentWeekStart },
              { weekStartsOn: 1 }
            );
            
            let totalAllocatedHours = 0;
            
            weeks.forEach(weekStart => {
              const weekKey = format(weekStart, 'yyyy-MM-dd');
              const weekAllocations = allocations?.filter(allocation => 
                allocation.week_start_date === weekKey && allocation.resource_id === memberId
              ) || [];
              
              const weekHours = weekAllocations.reduce((sum, allocation) => {
                console.log(`  Week ${weekKey}: ${allocation.hours}h (project: ${allocation.project_id})`);
                return sum + (Number(allocation.hours) || 0);
              }, 0);
              
              totalAllocatedHours += weekHours;
              console.log(`  Week ${weekKey} total: ${weekHours}h`);
            });
            
            const totalCapacity = memberCapacity * weeks.length;
            const utilizationPercentage = totalCapacity > 0 ? Math.round((totalAllocatedHours / totalCapacity) * 100) : 0;
            
            console.log(`  ${periodName} - Total hours: ${totalAllocatedHours}, Capacity: ${totalCapacity}, Utilization: ${utilizationPercentage}%`);
            
            return Math.min(utilizationPercentage, 100); // Cap at 100%
          };

          utilizationMap[memberId] = {
            memberId,
            days7: calculatePeriodUtilization(currentWeekStart, '7-day'),
            days30: calculatePeriodUtilization(thirtyDaysAgo, '30-day'),
            days90: calculatePeriodUtilization(ninetyDaysAgo, '90-day')
          };
        });

        console.log('Final individual utilizations:', utilizationMap);
        console.log('=== END INDIVIDUAL UTILIZATION DEBUG ===');
        
        setIndividualUtilizations(utilizationMap);
      } catch (error) {
        console.error('Error calculating individual utilizations:', error);
        // Initialize with zeros on error
        const errorMap: Record<string, IndividualUtilization> = {};
        memberIds.forEach(memberId => {
          errorMap[memberId] = { memberId, days7: 0, days30: 0, days90: 0 };
        });
        setIndividualUtilizations(errorMap);
      } finally {
        setIsLoading(false);
      }
    };

    fetchIndividualUtilizations();
  }, [company?.id, memberIds, teamMembers]);

  const getIndividualUtilization = (memberId: string): IndividualUtilization => {
    return individualUtilizations[memberId] || { memberId, days7: 0, days30: 0, days90: 0 };
  };

  return { individualUtilizations, getIndividualUtilization, isLoading };
};
