
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { addDays, parseISO } from 'date-fns';

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

      // Calculate week end date (6 days after start = 7 days total)
      const weekStart = parseISO(weekStartDate);
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

      // Fetch ALL office holidays for this week (including location-specific ones)
      const { data: holidaysRaw, error: holidaysError } = await supabase
        .from('office_holidays')
        .select('date, name, end_date, location_id')
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

      // Process holidays data - count unique holiday dates and apply to ALL members
      const holidaysData: Record<string, number> = {};
      
      if (holidaysRaw && holidaysRaw.length > 0) {
        // Get unique holiday dates (some holidays might have duplicates)
        const uniqueHolidayDates = new Set<string>();
        holidaysRaw.forEach(holiday => {
          uniqueHolidayDates.add(holiday.date);
        });
        
        const totalHolidayHours = uniqueHolidayDates.size * 8; // 8 hours per unique holiday day
        
        // Apply holiday hours to ALL members
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
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  return {
    annualLeaveData: data?.annualLeaveData || {},
    holidaysData: data?.holidaysData || {},
    isLoading,
    error
  };
};
