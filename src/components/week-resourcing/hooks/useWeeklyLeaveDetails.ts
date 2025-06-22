
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
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

  const { data: weeklyLeaveDetails, isLoading, error } = useQuery({
    queryKey: ['weekly-leave-details', company?.id, weekStartDate, memberIds],
    queryFn: async () => {
      if (!company?.id || memberIds.length === 0) {
        console.log('Skipping weekly leave details fetch - no company or members');
        return {};
      }

      console.log('Fetching weekly leave details for week:', weekStartDate, 'members:', memberIds.length);

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
        console.error('Error fetching weekly leave details:', error);
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

      console.log('Successfully fetched weekly leave details:', Object.keys(weeklyLeaveDetails).length, 'members with leave');

      return weeklyLeaveDetails;
    },
    enabled: !!company?.id && memberIds.length > 0 && enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    weeklyLeaveDetails: weeklyLeaveDetails || {},
    isLoading,
    error
  };
};
