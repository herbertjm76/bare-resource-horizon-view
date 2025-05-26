
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

  // Separate active and pre-registered members
  const { activeMembers, preRegisteredMembers } = useMemo(() => {
    const active = teamMembers.filter(member => 'company_id' in member && member.company_id);
    const preRegistered = teamMembers.filter(member => !('company_id' in member) || !member.company_id);
    
    console.log('=== MEMBER CATEGORIZATION ===');
    console.log('Active members:', active.map(m => ({ id: m.id, name: `${m.first_name} ${m.last_name}` })));
    console.log('Pre-registered members:', preRegistered.map(m => ({ id: m.id, name: `${m.first_name} ${m.last_name}` })));
    
    return { activeMembers: active, preRegisteredMembers: preRegistered };
  }, [teamMembers]);

  useEffect(() => {
    if (!company?.id || teamMembers.length === 0) {
      console.log('Individual utilization: No company or members, setting loading to false');
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
        
        const utilizationMap: Record<string, IndividualUtilization> = {};

        // Initialize utilization data for all members (active and pre-registered)
        teamMembers.forEach(member => {
          utilizationMap[member.id] = {
            memberId: member.id,
            days7: 0,
            days30: 0,
            days90: 0
          };
        });

        // Only fetch allocations for active members
        if (activeMembers.length > 0) {
          const activeMemberIds = activeMembers.map(member => member.id);
          
          console.log('Fetching allocations for active member IDs:', activeMemberIds);
          
          // Fetch allocations for active members
          const { data: activeAllocations, error: activeError } = await supabase
            .from('project_resource_allocations')
            .select('resource_id, hours, week_start_date, project_id, resource_type')
            .eq('company_id', company.id)
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

            // Calculate for different periods
            const calculatePeriodUtilization = (startDate: Date, periodName: string) => {
              const weeks = eachWeekOfInterval(
                { start: startDate, end: currentWeekStart },
                { weekStartsOn: 1 }
              );
              
              let totalAllocatedHours = 0;
              
              weeks.forEach(weekStart => {
                const weekKey = format(weekStart, 'yyyy-MM-dd');
                const weekAllocations = memberAllocations.filter(allocation => 
                  allocation.week_start_date === weekKey
                );
                
                const weekHours = weekAllocations.reduce((sum, allocation) => {
                  const hours = Number(allocation.hours) || 0;
                  console.log(`  Week ${weekKey}: ${hours}h (project: ${allocation.project_id}, type: ${allocation.resource_type})`);
                  return sum + hours;
                }, 0);
                
                totalAllocatedHours += weekHours;
                if (weekHours > 0) {
                  console.log(`  Week ${weekKey} total: ${weekHours}h`);
                }
              });
              
              const totalCapacity = memberCapacity * weeks.length;
              const utilizationPercentage = totalCapacity > 0 ? Math.round((totalAllocatedHours / totalCapacity) * 100) : 0;
              
              console.log(`  ${periodName} - Total hours: ${totalAllocatedHours}, Capacity: ${totalCapacity}, Utilization: ${utilizationPercentage}%`);
              
              return Math.min(utilizationPercentage, 100); // Cap at 100%
            };

            utilizationMap[member.id] = {
              memberId: member.id,
              days7: calculatePeriodUtilization(currentWeekStart, '7-day'),
              days30: calculatePeriodUtilization(thirtyDaysAgo, '30-day'),
              days90: calculatePeriodUtilization(ninetyDaysAgo, '90-day')
            };
          });
        }

        // Fetch allocations for pre-registered members
        if (preRegisteredMembers.length > 0) {
          const preRegisteredIds = preRegisteredMembers.map(member => member.id);
          
          console.log('Fetching allocations for pre-registered member IDs:', preRegisteredIds);
          
          const { data: preRegAllocations, error: preRegError } = await supabase
            .from('project_resource_allocations')
            .select('resource_id, hours, week_start_date, project_id, resource_type')
            .eq('company_id', company.id)
            .eq('resource_type', 'pre_registered')
            .in('resource_id', preRegisteredIds)
            .gte('week_start_date', format(ninetyDaysAgo, 'yyyy-MM-dd'))
            .lte('week_start_date', format(currentWeekStart, 'yyyy-MM-dd'));

          if (preRegError) throw preRegError;

          console.log('Pre-registered allocations fetched:', preRegAllocations?.length || 0);
          console.log('Pre-registered allocations data:', preRegAllocations);

          // Calculate utilization for pre-registered members
          preRegisteredMembers.forEach(member => {
            const memberCapacity = member.weekly_capacity || 40;
            
            console.log(`--- Pre-registered Member ${member.first_name} ${member.last_name} (${member.id}) (Capacity: ${memberCapacity}h/week) ---`);

            const memberAllocations = preRegAllocations?.filter(allocation => 
              allocation.resource_id === member.id
            ) || [];
            
            console.log(`Member allocations found: ${memberAllocations.length}`);

            if (memberAllocations.length > 0) {
              // Calculate for different periods (same logic as active members)
              const calculatePeriodUtilization = (startDate: Date, periodName: string) => {
                const weeks = eachWeekOfInterval(
                  { start: startDate, end: currentWeekStart },
                  { weekStartsOn: 1 }
                );
                
                let totalAllocatedHours = 0;
                
                weeks.forEach(weekStart => {
                  const weekKey = format(weekStart, 'yyyy-MM-dd');
                  const weekAllocations = memberAllocations.filter(allocation => 
                    allocation.week_start_date === weekKey
                  );
                  
                  const weekHours = weekAllocations.reduce((sum, allocation) => {
                    const hours = Number(allocation.hours) || 0;
                    console.log(`  Week ${weekKey}: ${hours}h (project: ${allocation.project_id}, type: ${allocation.resource_type})`);
                    return sum + hours;
                  }, 0);
                  
                  totalAllocatedHours += weekHours;
                  if (weekHours > 0) {
                    console.log(`  Week ${weekKey} total: ${weekHours}h`);
                  }
                });
                
                const totalCapacity = memberCapacity * weeks.length;
                const utilizationPercentage = totalCapacity > 0 ? Math.round((totalAllocatedHours / totalCapacity) * 100) : 0;
                
                console.log(`  ${periodName} - Total hours: ${totalAllocatedHours}, Capacity: ${totalCapacity}, Utilization: ${utilizationPercentage}%`);
                
                return Math.min(utilizationPercentage, 100); // Cap at 100%
              };

              utilizationMap[member.id] = {
                memberId: member.id,
                days7: calculatePeriodUtilization(currentWeekStart, '7-day'),
                days30: calculatePeriodUtilization(thirtyDaysAgo, '30-day'),
                days90: calculatePeriodUtilization(ninetyDaysAgo, '90-day')
              };
            }
            // If no allocations found, utilization remains 0 (already initialized)
          });
        }

        console.log('Final individual utilizations:', utilizationMap);
        console.log('=== END INDIVIDUAL UTILIZATION DEBUG ===');
        
        setIndividualUtilizations(utilizationMap);
      } catch (error) {
        console.error('Error calculating individual utilizations:', error);
        // Initialize with zeros on error
        const errorMap: Record<string, IndividualUtilization> = {};
        teamMembers.forEach(member => {
          errorMap[member.id] = { memberId: member.id, days7: 0, days30: 0, days90: 0 };
        });
        setIndividualUtilizations(errorMap);
      } finally {
        setIsLoading(false);
      }
    };

    fetchIndividualUtilizations();
  }, [company?.id, activeMembers, preRegisteredMembers, teamMembers]);

  const getIndividualUtilization = (memberId: string): IndividualUtilization => {
    return individualUtilizations[memberId] || { memberId, days7: 0, days30: 0, days90: 0 };
  };

  return { individualUtilizations, getIndividualUtilization, isLoading };
};
