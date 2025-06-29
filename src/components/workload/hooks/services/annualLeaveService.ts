
import { supabase } from '@/integrations/supabase/client';
import { format, startOfWeek, addWeeks } from 'date-fns';
import { WorkloadDataParams } from '../types';

export const fetchAnnualLeave = async (params: WorkloadDataParams) => {
  const { companyId, memberIds, startDate, numberOfWeeks } = params;

  const startWeek = startOfWeek(startDate, { weekStartsOn: 1 });
  const endWeek = addWeeks(startWeek, numberOfWeeks);
  const startDateString = format(startWeek, 'yyyy-MM-dd');
  const endDateString = format(endWeek, 'yyyy-MM-dd');

  const { data: annualLeaves, error } = await supabase
    .from('annual_leaves')
    .select('member_id, date, hours')
    .eq('company_id', companyId)
    .in('member_id', memberIds)
    .gte('date', startDateString)
    .lte('date', endDateString);

  if (error) {
    console.error('Error fetching annual leaves:', error);
    return [];
  }

  return annualLeaves || [];
};

export const processAnnualLeave = (
  annualLeaves: any[],
  result: Record<string, Record<string, any>>
) => {
  annualLeaves.forEach(leave => {
    const weekStart = startOfWeek(new Date(leave.date), { weekStartsOn: 1 });
    const weekKey = format(weekStart, 'yyyy-MM-dd');
    const hours = leave.hours || 0;
    
    if (result[leave.member_id] && result[leave.member_id][weekKey]) {
      result[leave.member_id][weekKey].annualLeave += hours;
      result[leave.member_id][weekKey].total += hours;
    }
  });
};
