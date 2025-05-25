
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
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
            
            const allocationDate = allocation.week_start_date;
            const dateKey = format(new Date(allocationDate), 'yyyy-MM-dd');
            const allocationDateObj = new Date(allocationDate);
            
            if (allocationDateObj.getMonth() === selectedMonth.getMonth() && 
                allocationDateObj.getFullYear() === selectedMonth.getFullYear()) {
              
              const totalHours = Number(allocation.hours) || 0;
              
              if (workload[allocation.resource_id] && 
                  workload[allocation.resource_id][dateKey] !== undefined) {
                workload[allocation.resource_id][dateKey].projectHours += totalHours;
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
