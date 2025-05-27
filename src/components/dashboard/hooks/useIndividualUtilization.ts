
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { format, startOfWeek, startOfMonth, subMonths, endOfWeek, endOfMonth } from 'date-fns';
import { TimeRange } from '../TimeRangeSelector';

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
      case '4months':
        startDate = subMonths(startOfMonth(now), 4);
        endDate = endOfMonth(now);
        break;
      case '6months':
        startDate = subMonths(startOfMonth(now), 6);
        endDate = endOfMonth(now);
        break;
      case 'year':
        startDate = subMonths(startOfMonth(now), 12);
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
        return weeklyCapacity; // 1 week
      case 'month':
        return weeklyCapacity * 4; // 4 weeks
      case '3months':
        return weeklyCapacity * 12; // 12 weeks
      case '4months':
        return weeklyCapacity * 16; // 16 weeks
      case '6months':
        return weeklyCapacity * 24; // 24 weeks
      case 'year':
        return weeklyCapacity * 48; // 48 weeks
      default:
        return weeklyCapacity * 4; // Default to 4 weeks
    }
  };

  useEffect(() => {
    const calculateUtilizations = async () => {
      if (!company?.id || !teamMembers?.length) {
        console.log('No company or team members available for utilization calculation');
        setIsLoading(false);
        return;
      }

      console.log('=== INDIVIDUAL UTILIZATION CALCULATION ===');
      console.log('Company ID:', company.id);
      console.log('Team members to calculate utilization for:', teamMembers.length);
      console.log('Selected time range:', selectedTimeRange);

      try {
        const utilizations: Record<string, number> = {};
        const { startDate, endDate } = getDateRange();
        
        console.log('Calculating utilization for period:', startDate, 'to', endDate);

        for (const member of teamMembers) {
          const memberName = `${member.first_name || ''} ${member.last_name || ''}`.trim();
          console.log(`\n--- Processing member: ${memberName} (ID: ${member.id}) ---`);
          console.log('Is pending:', member.isPending);
          console.log('Selected time range:', selectedTimeRange);
          
          let totalAllocatedHours = 0;
          
          if (member.isPending) {
            // For pre-registered members, check pending_resources and their allocations
            console.log('Checking pending resources allocations...');
            
            const { data: allocations, error } = await supabase
              .from('project_resource_allocations')
              .select('hours')
              .eq('resource_id', member.id)
              .eq('resource_type', 'pre_registered')
              .eq('company_id', company.id)
              .gte('week_start_date', startDate)
              .lte('week_start_date', endDate);

            if (error) {
              console.error(`Error fetching allocations for pending member ${memberName}:`, error);
            } else {
              totalAllocatedHours = allocations?.reduce((sum, allocation) => sum + (allocation.hours || 0), 0) || 0;
              console.log(`Pending member ${memberName} allocations:`, allocations);
              console.log(`Total allocated hours for period: ${totalAllocatedHours}`);
            }
          } else {
            // For active members, check project_resources and their allocations
            console.log('Checking active member allocations...');
            
            const { data: allocations, error } = await supabase
              .from('project_resource_allocations')
              .select('hours')
              .eq('resource_id', member.id)
              .eq('resource_type', 'active')
              .eq('company_id', company.id)
              .gte('week_start_date', startDate)
              .lte('week_start_date', endDate);

            if (error) {
              console.error(`Error fetching allocations for active member ${memberName}:`, error);
            } else {
              totalAllocatedHours = allocations?.reduce((sum, allocation) => sum + (allocation.hours || 0), 0) || 0;
              console.log(`Active member ${memberName} allocations:`, allocations);
              console.log(`Total allocated hours for period: ${totalAllocatedHours}`);
            }
          }

          // Calculate utilization percentage based on time range capacity
          const weeklyCapacity = member.weekly_capacity || 40;
          const totalCapacityForPeriod = getTotalCapacity(weeklyCapacity);
          const utilization = totalCapacityForPeriod > 0 ? (totalAllocatedHours / totalCapacityForPeriod) * 100 : 0;
          
          console.log(`Member ${memberName} (${selectedTimeRange}):`);
          console.log(`- Weekly capacity: ${weeklyCapacity} hours`);
          console.log(`- Total capacity for period: ${totalCapacityForPeriod} hours`);
          console.log(`- Total allocated: ${totalAllocatedHours} hours`);
          console.log(`- Utilization: ${utilization.toFixed(1)}%`);
          
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
