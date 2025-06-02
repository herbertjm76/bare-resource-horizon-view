
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { format, addDays, isWeekend } from 'date-fns';
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
            
            // Count actual working days (Monday to Friday) in this week that fall within the selected month
            const workingDays = [];
            for (let i = 0; i < 7; i++) {
              const day = addDays(weekStartDate, i);
              if (!isWeekend(day) && 
                  day.getMonth() === selectedMonth.getMonth() && 
                  day.getFullYear() === selectedMonth.getFullYear()) {
                workingDays.push(day);
              }
            }
            
            // Only distribute hours if there are working days
            if (workingDays.length > 0) {
              const dailyHours = weeklyHours / workingDays.length;
              
              workingDays.forEach(workDay => {
                const dateKey = format(workDay, 'yyyy-MM-dd');
                
                if (!projectHours[allocation.resource_id][dateKey]) {
                  projectHours[allocation.resource_id][dateKey] = 0;
                }
                projectHours[allocation.resource_id][dateKey] += dailyHours;
              });
            }
          });
          
          console.log('Processed project allocations (per day):', projectHours);
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
