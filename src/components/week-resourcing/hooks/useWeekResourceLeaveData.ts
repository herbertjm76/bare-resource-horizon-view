
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { startOfWeek, endOfWeek, addDays } from 'date-fns';

interface UseWeekResourceLeaveDataOptions {
  weekStartDate: string;
  memberIds: string[];
  enabled?: boolean;
}

export const useWeekResourceLeaveData = ({ 
  weekStartDate, 
  memberIds,
  enabled = true 
}: UseWeekResourceLeaveDataOptions) => {
  const { company } = useCompany();

  const { data, isLoading, error } = useQuery({
    queryKey: ['week-resource-leave-data', company?.id, weekStartDate, memberIds],
    queryFn: async () => {
      if (!company?.id || memberIds.length === 0) {
        return { annualLeaveData: {}, holidaysData: {} };
      }

      // Calculate week end date
      const weekStart = new Date(weekStartDate);
      const weekEnd = addDays(weekStart, 6);
      const weekEndString = weekEnd.toISOString().split('T')[0];

      // Fetch annual leave data
      const { data: annualLeaveRaw, error: annualLeaveError } = await supabase
        .from('annual_leaves')
        .select('member_id, date, hours')
        .eq('company_id', company.id)
        .in('member_id', memberIds)
        .gte('date', weekStartDate)
        .lte('date', weekEndString);

      if (annualLeaveError) {
        throw annualLeaveError;
      }

      // Fetch office holidays
      const { data: holidaysRaw, error: holidaysError } = await supabase
        .from('office_holidays')
        .select('date, name, end_date')
        .eq('company_id', company.id)
        .gte('date', weekStartDate)
        .lte('date', weekEndString);

      if (holidaysError) {
        throw holidaysError;
      }

      // Process annual leave data
      const annualLeaveData: Record<string, number> = {};
      annualLeaveRaw?.forEach(leave => {
        if (!annualLeaveData[leave.member_id]) {
          annualLeaveData[leave.member_id] = 0;
        }
        annualLeaveData[leave.member_id] += leave.hours || 0;
      });

      // Process holidays data - assuming 8 hours per holiday day for all members
      const holidaysData: Record<string, number> = {};
      if (holidaysRaw && holidaysRaw.length > 0) {
        const totalHolidayHours = holidaysRaw.length * 8; // 8 hours per holiday
        memberIds.forEach(memberId => {
          holidaysData[memberId] = totalHolidayHours;
        });
      }

      return {
        annualLeaveData,
        holidaysData
      };
    },
    enabled: !!company?.id && memberIds.length > 0 && enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    annualLeaveData: data?.annualLeaveData || {},
    holidaysData: data?.holidaysData || {},
    isLoading,
    error
  };
};
