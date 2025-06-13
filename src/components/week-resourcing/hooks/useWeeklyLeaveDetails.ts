
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { format, endOfWeek } from 'date-fns';

interface UseWeeklyLeaveDetailsProps {
  weekStartDate: string;
  memberIds: string[];
}

export const useWeeklyLeaveDetails = ({ weekStartDate, memberIds }: UseWeeklyLeaveDetailsProps) => {
  const { company } = useCompany();

  const { data: weeklyLeaveDetails } = useQuery({
    queryKey: ['weekly-leave-details', weekStartDate, company?.id, memberIds],
    queryFn: async () => {
      if (!company?.id || memberIds.length === 0) return {};

      const weekStart = new Date(weekStartDate);
      const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });

      console.log('Fetching detailed annual leave for week:', weekStartDate);

      const { data, error } = await supabase
        .from('annual_leaves')
        .select('member_id, date, hours')
        .eq('company_id', company.id)
        .in('member_id', memberIds)
        .gte('date', format(weekStart, 'yyyy-MM-dd'))
        .lte('date', format(weekEnd, 'yyyy-MM-dd'));

      if (error) {
        console.error('Error fetching detailed annual leave:', error);
        return {};
      }

      // Group by member
      const leaveByMember: Record<string, Array<{ date: string; hours: number }>> = {};
      data?.forEach(leave => {
        if (!leaveByMember[leave.member_id]) {
          leaveByMember[leave.member_id] = [];
        }
        leaveByMember[leave.member_id].push({
          date: leave.date,
          hours: Number(leave.hours) || 0
        });
      });

      console.log('Detailed leave data processed:', leaveByMember);
      return leaveByMember;
    },
    enabled: !!company?.id && memberIds.length > 0
  });

  return { weeklyLeaveDetails };
};
