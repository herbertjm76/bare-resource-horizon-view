
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { format, startOfWeek, endOfMonth, addDays } from 'date-fns';
import { TeamMember } from '@/components/dashboard/types';
import { WorkloadBreakdown } from './types';

export const useWeeklyOtherLeave = (
  selectedMonth: Date, 
  teamMembers: TeamMember[], 
  companyId: string | undefined,
  workload: Record<string, Record<string, WorkloadBreakdown>>
) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!companyId || teamMembers.length === 0) return;

    const fetchWeeklyOtherLeave = async () => {
      setIsLoading(true);
      
      try {
        const memberIds = teamMembers.map(member => member.id);

        // Get all week start dates that overlap with our month
        const weekStarts: string[] = [];
        let currentWeekStart = startOfWeek(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1), { weekStartsOn: 1 });
        const monthEndDate = endOfMonth(selectedMonth);
        
        while (currentWeekStart <= monthEndDate) {
          weekStarts.push(format(currentWeekStart, 'yyyy-MM-dd'));
          currentWeekStart = addDays(currentWeekStart, 7);
        }

        console.log('Fetching weekly other leave for member IDs:', memberIds);

        const { data: otherLeaveData, error } = await supabase
          .from('weekly_other_leave')
          .select('member_id, week_start_date, hours, leave_type, notes')
          .eq('company_id', companyId)
          .in('member_id', memberIds)
          .in('week_start_date', weekStarts);
        
        if (error) {
          console.error('Error fetching weekly other leave data:', error);
        } else if (otherLeaveData) {
          otherLeaveData.forEach(leave => {
            const weekStartDate = new Date(leave.week_start_date);
            const hours = Number(leave.hours) || 0;
            
            // Distribute hours across the work week (Monday to Friday)
            const dailyHours = hours / 5;
            
            for (let i = 0; i < 5; i++) {
              const workDay = addDays(weekStartDate, i);
              const dateKey = format(workDay, 'yyyy-MM-dd');
              
              if (workDay.getMonth() === selectedMonth.getMonth() && 
                  workDay.getFullYear() === selectedMonth.getFullYear()) {
                
                if (workload[leave.member_id] && workload[leave.member_id][dateKey]) {
                  workload[leave.member_id][dateKey].otherLeave += dailyHours;
                }
              }
            }
          });
        }
      } catch (error) {
        console.error('Error in fetchWeeklyOtherLeave:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeeklyOtherLeave();
  }, [companyId, selectedMonth, teamMembers, workload]);

  return { isLoading };
};
