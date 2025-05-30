
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { format, startOfWeek, endOfWeek, addWeeks, startOfMonth, endOfMonth, addMonths, eachWeekOfInterval } from 'date-fns';

interface LeaveInsight {
  nextWeekCount: number;
  nextMonthCount: number;
  peakWeek: {
    weekStart: string;
    count: number;
  } | null;
}

export const useAnnualLeaveInsights = (teamMembers: any[]) => {
  const [insights, setInsights] = useState<LeaveInsight>({
    nextWeekCount: 0,
    nextMonthCount: 0,
    peakWeek: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const { company } = useCompany();

  useEffect(() => {
    if (!company?.id || teamMembers.length === 0) {
      setInsights({ nextWeekCount: 0, nextMonthCount: 0, peakWeek: null });
      return;
    }

    const fetchLeaveInsights = async () => {
      setIsLoading(true);
      
      try {
        const today = new Date();
        const nextWeekStart = startOfWeek(addWeeks(today, 1), { weekStartsOn: 1 });
        const nextWeekEnd = endOfWeek(addWeeks(today, 1), { weekStartsOn: 1 });
        const nextMonthStart = startOfMonth(addMonths(today, 1));
        const nextMonthEnd = endOfMonth(addMonths(today, 1));
        
        // Get next 12 weeks to find peak week
        const futureEnd = addWeeks(today, 12);
        
        const memberIds = teamMembers.map(member => member.id);
        
        // Fetch all future annual leave data
        const { data: leaveData, error } = await supabase
          .from('annual_leaves')
          .select('member_id, date, hours')
          .eq('company_id', company.id)
          .in('member_id', memberIds)
          .gte('date', format(today, 'yyyy-MM-dd'))
          .lte('date', format(futureEnd, 'yyyy-MM-dd'));

        if (error) {
          console.error('Error fetching leave insights:', error);
          return;
        }

        // Count next week leave
        const nextWeekLeave = leaveData?.filter(leave => {
          const leaveDate = new Date(leave.date);
          return leaveDate >= nextWeekStart && leaveDate <= nextWeekEnd && leave.hours > 0;
        }) || [];
        
        const nextWeekMembers = new Set(nextWeekLeave.map(leave => leave.member_id));

        // Count next month leave
        const nextMonthLeave = leaveData?.filter(leave => {
          const leaveDate = new Date(leave.date);
          return leaveDate >= nextMonthStart && leaveDate <= nextMonthEnd && leave.hours > 0;
        }) || [];
        
        const nextMonthMembers = new Set(nextMonthLeave.map(leave => leave.member_id));

        // Find peak week
        const weeks = eachWeekOfInterval({
          start: today,
          end: futureEnd
        }, { weekStartsOn: 1 });
        
        let peakWeek = null;
        let maxCount = 0;
        
        weeks.forEach(weekStart => {
          const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
          const weekLeave = leaveData?.filter(leave => {
            const leaveDate = new Date(leave.date);
            return leaveDate >= weekStart && leaveDate <= weekEnd && leave.hours > 0;
          }) || [];
          
          const weekMembers = new Set(weekLeave.map(leave => leave.member_id));
          
          if (weekMembers.size > maxCount) {
            maxCount = weekMembers.size;
            peakWeek = {
              weekStart: format(weekStart, 'MMM d'),
              count: weekMembers.size
            };
          }
        });

        setInsights({
          nextWeekCount: nextWeekMembers.size,
          nextMonthCount: nextMonthMembers.size,
          peakWeek
        });
        
      } catch (error) {
        console.error('Error in fetchLeaveInsights:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaveInsights();
  }, [company?.id, teamMembers]);

  return { insights, isLoading };
};
