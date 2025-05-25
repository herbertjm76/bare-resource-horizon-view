
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { format, addDays } from 'date-fns';
import { TeamMember } from '@/components/dashboard/types';
import { WorkloadBreakdown } from './types';

export const useProjectAllocations = (
  selectedMonth: Date, 
  teamMembers: TeamMember[], 
  companyId: string | undefined,
  workload: Record<string, Record<string, WorkloadBreakdown>>
) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!companyId || teamMembers.length === 0) return;

    const fetchProjectAllocations = async () => {
      setIsLoading(true);
      
      try {
        const monthStart = format(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1), 'yyyy-MM-dd');
        const monthEnd = format(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0), 'yyyy-MM-dd');
        const memberIds = teamMembers.map(member => member.id);

        console.log('Fetching project allocations for member IDs:', memberIds);

        const { data: allocations, error } = await supabase
          .from('project_resource_allocations')
          .select('resource_id, hours, week_start_date, project_id, project:projects(name, code)')
          .eq('company_id', companyId)
          .in('resource_id', memberIds)
          .gte('week_start_date', monthStart)
          .lte('week_start_date', monthEnd);
        
        if (error) {
          console.error('Error fetching project allocations:', error);
        } else if (allocations) {
          allocations.forEach(allocation => {
            if (!allocation.resource_id || !allocation.week_start_date || !allocation.hours) return;
            
            const weekStartDate = new Date(allocation.week_start_date);
            const weeklyHours = Number(allocation.hours) || 0;
            
            // Distribute weekly hours across 5 workdays (Monday to Friday)
            const dailyHours = weeklyHours / 5;
            
            // Generate all 5 weekdays for this allocation
            for (let i = 0; i < 5; i++) {
              const workDay = addDays(weekStartDate, i);
              const dateKey = format(workDay, 'yyyy-MM-dd');
              
              // Only add hours for days that fall within the selected month
              if (workDay.getMonth() === selectedMonth.getMonth() && 
                  workDay.getFullYear() === selectedMonth.getFullYear()) {
                
                if (workload[allocation.resource_id] && 
                    workload[allocation.resource_id][dateKey] !== undefined) {
                  workload[allocation.resource_id][dateKey].projectHours += dailyHours;
                }
              }
            }
          });
        }
      } catch (error) {
        console.error('Error in fetchProjectAllocations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectAllocations();
  }, [companyId, selectedMonth, teamMembers, workload]);

  return { isLoading };
};
