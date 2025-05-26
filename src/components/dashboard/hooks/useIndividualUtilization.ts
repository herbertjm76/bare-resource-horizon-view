
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { format, startOfWeek, endOfWeek } from 'date-fns';

interface TeamMember {
  id: string;
  first_name?: string;
  last_name?: string;
  weekly_capacity?: number;
  isPending?: boolean;
}

export const useIndividualUtilization = (teamMembers: TeamMember[]) => {
  const [memberUtilizations, setMemberUtilizations] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const { company } = useCompany();

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

      try {
        const utilizations: Record<string, number> = {};
        
        // Get current week range
        const now = new Date();
        const weekStart = startOfWeek(now, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
        const weekStartStr = format(weekStart, 'yyyy-MM-dd');
        
        console.log('Calculating utilization for week:', weekStartStr);

        for (const member of teamMembers) {
          const memberName = `${member.first_name || ''} ${member.last_name || ''}`.trim();
          console.log(`\n--- Processing member: ${memberName} (ID: ${member.id}) ---`);
          console.log('Is pending:', member.isPending);
          
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
              .gte('week_start_date', weekStartStr)
              .lt('week_start_date', format(weekEnd, 'yyyy-MM-dd'));

            if (error) {
              console.error(`Error fetching allocations for pending member ${memberName}:`, error);
            } else {
              totalAllocatedHours = allocations?.reduce((sum, allocation) => sum + (allocation.hours || 0), 0) || 0;
              console.log(`Pending member ${memberName} allocations:`, allocations);
              console.log(`Total allocated hours: ${totalAllocatedHours}`);
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
              .gte('week_start_date', weekStartStr)
              .lt('week_start_date', format(weekEnd, 'yyyy-MM-dd'));

            if (error) {
              console.error(`Error fetching allocations for active member ${memberName}:`, error);
            } else {
              totalAllocatedHours = allocations?.reduce((sum, allocation) => sum + (allocation.hours || 0), 0) || 0;
              console.log(`Active member ${memberName} allocations:`, allocations);
              console.log(`Total allocated hours: ${totalAllocatedHours}`);
            }
          }

          // Calculate utilization percentage
          const weeklyCapacity = member.weekly_capacity || 40;
          const utilization = weeklyCapacity > 0 ? (totalAllocatedHours / weeklyCapacity) * 100 : 0;
          
          console.log(`Member ${memberName}:`);
          console.log(`- Weekly capacity: ${weeklyCapacity} hours`);
          console.log(`- Total allocated: ${totalAllocatedHours} hours`);
          console.log(`- Utilization: ${utilization.toFixed(1)}%`);
          
          utilizations[member.id] = Math.round(utilization);
        }

        console.log('\n=== FINAL UTILIZATIONS ===');
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
  }, [teamMembers, company?.id]);

  return {
    memberUtilizations,
    isLoading
  };
};
