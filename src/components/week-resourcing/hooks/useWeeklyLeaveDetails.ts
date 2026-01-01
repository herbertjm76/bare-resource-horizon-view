
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { useDemoAuth } from '@/hooks/useDemoAuth';
import { generateDemoAnnualLeaves } from '@/data/demoData';
import { addDays } from 'date-fns';

interface UseWeeklyLeaveDetailsOptions {
  weekStartDate: string;
  memberIds: string[];
  enabled?: boolean;
}

export const useWeeklyLeaveDetails = ({ 
  weekStartDate, 
  memberIds,
  enabled = true 
}: UseWeeklyLeaveDetailsOptions) => {
  const { company } = useCompany();
  const { isDemoMode } = useDemoAuth();

  const { data: weeklyLeaveDetails, isLoading, error } = useQuery({
    queryKey: ['weekly-leave-details', isDemoMode ? 'demo' : company?.id, weekStartDate, memberIds],
    queryFn: async () => {
      // Demo mode: filter demo leave data
      if (isDemoMode) {
        const allLeaves = generateDemoAnnualLeaves();
        const weekStart = new Date(weekStartDate);
        const weekEnd = addDays(weekStart, 6);

        const result: Record<string, Array<{ date: string; hours: number }>> = {};
        
        allLeaves.forEach(leave => {
          const leaveDate = new Date(leave.date);
          if (
            memberIds.includes(leave.member_id) &&
            leaveDate >= weekStart &&
            leaveDate <= weekEnd
          ) {
            if (!result[leave.member_id]) {
              result[leave.member_id] = [];
            }
            result[leave.member_id].push({
              date: leave.date,
              hours: leave.hours
            });
          }
        });

        return result;
      }

      if (!company?.id || memberIds.length === 0) {
        return {};
      }

      // Calculate week end date
      const weekStart = new Date(weekStartDate);
      const weekEnd = addDays(weekStart, 6);
      const weekEndString = weekEnd.toISOString().split('T')[0];

      // Get detailed leave data for the week
      const { data, error } = await supabase
        .from('annual_leaves')
        .select('member_id, date, hours')
        .eq('company_id', company.id)
        .in('member_id', memberIds)
        .gte('date', weekStartDate)
        .lte('date', weekEndString)
        .order('date');

      if (error) {
        throw error;
      }

      // Organize by member
      const weeklyLeaveDetails: Record<string, Array<{ date: string; hours: number }>> = {};
      
      data?.forEach(leave => {
        if (!weeklyLeaveDetails[leave.member_id]) {
          weeklyLeaveDetails[leave.member_id] = [];
        }
        weeklyLeaveDetails[leave.member_id].push({
          date: leave.date,
          hours: leave.hours || 0
        });
      });

      return weeklyLeaveDetails;
    },
    enabled: (isDemoMode || !!company?.id) && memberIds.length > 0 && enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    weeklyLeaveDetails: weeklyLeaveDetails || {},
    isLoading,
    error
  };
};
