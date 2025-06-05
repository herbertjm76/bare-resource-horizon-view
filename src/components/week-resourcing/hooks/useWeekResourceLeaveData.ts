
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { format, addDays, startOfWeek, endOfWeek } from 'date-fns';

interface UseWeekResourceLeaveDataProps {
  weekStartDate: string;
  memberIds: string[];
}

export const useWeekResourceLeaveData = ({ weekStartDate, memberIds }: UseWeekResourceLeaveDataProps) => {
  const { company } = useCompany();

  // Fetch annual leave data
  const { data: annualLeaveData, isLoading: isLoadingAnnualLeave } = useQuery({
    queryKey: ['week-annual-leave', weekStartDate, company?.id, memberIds],
    queryFn: async () => {
      if (!company?.id || memberIds.length === 0) return {};

      const weekStart = new Date(weekStartDate);
      const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });

      console.log('Fetching annual leave for week:', weekStartDate);

      const { data, error } = await supabase
        .from('annual_leaves')
        .select('member_id, date, hours')
        .eq('company_id', company.id)
        .in('member_id', memberIds)
        .gte('date', format(weekStart, 'yyyy-MM-dd'))
        .lte('date', format(weekEnd, 'yyyy-MM-dd'));

      if (error) {
        console.error('Error fetching annual leave:', error);
        return {};
      }

      // Aggregate hours by member
      const leaveByMember: Record<string, number> = {};
      data?.forEach(leave => {
        if (!leaveByMember[leave.member_id]) {
          leaveByMember[leave.member_id] = 0;
        }
        leaveByMember[leave.member_id] += Number(leave.hours) || 0;
      });

      console.log('Annual leave data processed:', leaveByMember);
      return leaveByMember;
    },
    enabled: !!company?.id && memberIds.length > 0
  });

  // Fetch office holidays data
  const { data: holidaysData, isLoading: isLoadingHolidays } = useQuery({
    queryKey: ['week-office-holidays', weekStartDate, company?.id],
    queryFn: async () => {
      if (!company?.id) return {};

      const weekStart = new Date(weekStartDate);
      const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });

      console.log('Fetching office holidays for week:', weekStartDate);

      const { data, error } = await supabase
        .from('office_holidays')
        .select('date, end_date, name')
        .eq('company_id', company.id)
        .or(`date.lte.${format(weekEnd, 'yyyy-MM-dd')},end_date.gte.${format(weekStart, 'yyyy-MM-dd')}`);

      if (error) {
        console.error('Error fetching office holidays:', error);
        return {};
      }

      // Calculate holiday hours for each member
      const holidaysByMember: Record<string, number> = {};
      
      data?.forEach(holiday => {
        const startDate = new Date(holiday.date);
        const endDate = holiday.end_date ? new Date(holiday.end_date) : startDate;
        
        // Calculate days that fall within the week
        let holidayHours = 0;
        for (let d = new Date(Math.max(startDate.getTime(), weekStart.getTime())); 
             d <= Math.min(endDate.getTime(), weekEnd.getTime()); 
             d.setDate(d.getDate() + 1)) {
          // Skip weekends (Saturday = 6, Sunday = 0)
          if (d.getDay() !== 0 && d.getDay() !== 6) {
            holidayHours += 8; // Standard 8-hour holiday
          }
        }
        
        // Apply to all members
        memberIds.forEach(memberId => {
          if (!holidaysByMember[memberId]) {
            holidaysByMember[memberId] = 0;
          }
          holidaysByMember[memberId] += holidayHours;
        });
      });

      console.log('Office holidays data processed:', holidaysByMember);
      return holidaysByMember;
    },
    enabled: !!company?.id && memberIds.length > 0
  });

  return {
    annualLeaveData: annualLeaveData || {},
    holidaysData: holidaysData || {},
    isLoading: isLoadingAnnualLeave || isLoadingHolidays
  };
};
