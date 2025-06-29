
import { supabase } from '@/integrations/supabase/client';
import { format, startOfWeek, addWeeks } from 'date-fns';
import { WorkloadDataParams } from '../types';

export const fetchOtherLeave = async (params: WorkloadDataParams) => {
  const { companyId, memberIds, startDate, numberOfWeeks } = params;

  // Generate week start dates
  const weekStartDates = [];
  for (let i = 0; i < numberOfWeeks; i++) {
    const weekStart = startOfWeek(addWeeks(startDate, i), { weekStartsOn: 1 });
    weekStartDates.push(format(weekStart, 'yyyy-MM-dd'));
  }

  const { data: otherLeaves, error } = await supabase
    .from('weekly_other_leave')
    .select('member_id, week_start_date, hours')
    .eq('company_id', companyId)
    .in('member_id', memberIds)
    .in('week_start_date', weekStartDates);

  if (error) {
    console.error('Error fetching other leaves:', error);
    return [];
  }

  return otherLeaves || [];
};

export const processOtherLeave = (
  otherLeaves: any[],
  result: Record<string, Record<string, any>>
) => {
  otherLeaves.forEach(leave => {
    const weekKey = leave.week_start_date;
    const hours = leave.hours || 0;
    
    if (result[leave.member_id] && result[leave.member_id][weekKey]) {
      result[leave.member_id][weekKey].otherLeave += hours;
      result[leave.member_id][weekKey].total += hours;
    }
  });
};
