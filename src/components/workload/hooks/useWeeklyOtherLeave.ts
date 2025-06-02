
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { format, startOfWeek, endOfMonth, addDays, isWeekend } from 'date-fns';
import { TeamMember } from '@/components/dashboard/types';

export const useWeeklyOtherLeave = (
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
          setData({});
        } else if (otherLeaveData) {
          const otherLeaveHours: Record<string, Record<string, number>> = {};
          
          // Initialize structure
          memberIds.forEach(memberId => {
            otherLeaveHours[memberId] = {};
          });
          
          otherLeaveData.forEach(leave => {
            const weekStartDate = new Date(leave.week_start_date);
            const hours = Number(leave.hours) || 0;
            
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
              const dailyHours = hours / workingDays.length;
              
              workingDays.forEach(workDay => {
                const dateKey = format(workDay, 'yyyy-MM-dd');
                
                if (!otherLeaveHours[leave.member_id][dateKey]) {
                  otherLeaveHours[leave.member_id][dateKey] = 0;
                }
                otherLeaveHours[leave.member_id][dateKey] += dailyHours;
              });
            }
          });
          
          console.log('Processed weekly other leave data (per day):', otherLeaveHours);
          setData(otherLeaveHours);
        }
      } catch (error) {
        console.error('Error in fetchWeeklyOtherLeave:', error);
        setData({});
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeeklyOtherLeave();
  }, [companyId, selectedMonth, teamMembers]);

  return { data, isLoading };
};
