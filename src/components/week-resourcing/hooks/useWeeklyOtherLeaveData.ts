
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { toast } from 'sonner';

export const useWeeklyOtherLeaveData = (
  weekStartDate: string, 
  memberIds: string[],
  enabled: boolean = true
) => {
  const { company } = useCompany();
  const queryClient = useQueryClient();

  const { data: otherLeaveData = {}, isLoading, error } = useQuery({
    queryKey: ['weekly-other-leave', company?.id, weekStartDate, memberIds],
    queryFn: async () => {
      if (!company?.id || memberIds.length === 0) {
        console.log('Skipping other leave data fetch - no company or members');
        return {};
      }

      console.log('Fetching other leave data for week:', weekStartDate, 'members:', memberIds.length);

      const { data, error } = await supabase
        .from('weekly_other_leave')
        .select('member_id, hours, leave_type, notes')
        .eq('company_id', company.id)
        .eq('week_start_date', weekStartDate)
        .in('member_id', memberIds);

      if (error) {
        console.error('Error fetching other leave data:', error);
        throw error;
      }

      // Convert to map for easy lookup
      const otherLeaveMap: Record<string, number> = {};
      data?.forEach(leave => {
        otherLeaveMap[leave.member_id] = leave.hours || 0;
      });

      console.log('Successfully fetched other leave data:', data?.length || 0, 'entries');

      return otherLeaveMap;
    },
    enabled: !!company?.id && memberIds.length > 0 && enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  const updateOtherLeaveMutation = useMutation({
    mutationFn: async ({ memberId, hours }: { memberId: string; hours: number }) => {
      if (!company?.id) throw new Error('No company ID');

      const { data, error } = await supabase
        .from('weekly_other_leave')
        .upsert({
          member_id: memberId,
          company_id: company.id,
          week_start_date: weekStartDate,
          hours: hours,
          leave_type: 'other'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate the query to refetch data
      queryClient.invalidateQueries({ 
        queryKey: ['weekly-other-leave', company?.id, weekStartDate] 
      });
    },
    onError: (error) => {
      console.error('Error updating other leave:', error);
      toast.error('Failed to update other leave');
    }
  });

  const updateOtherLeave = async (memberId: string, hours: number) => {
    try {
      await updateOtherLeaveMutation.mutateAsync({ memberId, hours });
      return true;
    } catch (error) {
      console.error('Failed to update other leave:', error);
      return false;
    }
  };

  return {
    otherLeaveData,
    isLoading,
    error,
    updateOtherLeave
  };
};
