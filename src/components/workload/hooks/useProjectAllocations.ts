
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { format, addDays } from 'date-fns';
import { TeamMember } from '@/components/dashboard/types';

export const useProjectAllocations = (
  selectedMonth: Date, 
  teamMembers: TeamMember[], 
  companyId: string | undefined
) => {
  const [data, setData] = useState<Record<string, Record<string, number>>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!companyId || teamMembers.length === 0) {
      setData({});
      setIsLoading(false);
      return;
    }

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
          setData({});
        } else if (allocations) {
          const projectHours: Record<string, Record<string, number>> = {};
          
          // Initialize structure
          memberIds.forEach(memberId => {
            projectHours[memberId] = {};
          });
          
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
                
                if (!projectHours[allocation.resource_id][dateKey]) {
                  projectHours[allocation.resource_id][dateKey] = 0;
                }
                projectHours[allocation.resource_id][dateKey] += dailyHours;
              }
            }
          });
          
          console.log('Processed project allocations:', projectHours);
          setData(projectHours);
        }
      } catch (error) {
        console.error('Error in fetchProjectAllocations:', error);
        setData({});
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectAllocations();
  }, [companyId, selectedMonth, teamMembers]);

  return { data, isLoading };
};
