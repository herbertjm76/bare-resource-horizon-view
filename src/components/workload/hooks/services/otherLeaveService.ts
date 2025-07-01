
import { supabase } from '@/integrations/supabase/client';
import { WorkloadDataParams, ProcessedWorkloadResult } from '../types';
import { format, startOfWeek } from 'date-fns';

export const fetchOtherLeave = async (params: WorkloadDataParams) => {
  const { companyId, memberIds, startDate, numberOfWeeks } = params;
  
  // Calculate the end date for the period
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + (numberOfWeeks * 7));
  
  const { data, error } = await supabase
    .from('weekly_other_leave')
    .select('member_id, week_start_date, hours')
    .eq('company_id', companyId)
    .in('member_id', memberIds)
    .gte('week_start_date', format(startDate, 'yyyy-MM-dd'))
    .lt('week_start_date', format(endDate, 'yyyy-MM-dd'));

  if (error) {
    console.error('Error fetching other leave:', error);
    throw error;
  }

  return data || [];
};

export const processOtherLeave = (
  otherLeaves: any[],
  result: ProcessedWorkloadResult
) => {
  if (otherLeaves.length === 0) return;

  // Use Map for faster aggregation
  const memberWeekHours = new Map<string, Map<string, number>>();

  // Single pass aggregation
  for (const leave of otherLeaves) {
    const memberId = leave.member_id;
    const weekStartDate = new Date(leave.week_start_date);
    const weekKey = format(weekStartDate, 'yyyy-MM-dd');
    const hours = parseFloat(leave.hours) || 0;

    if (!memberWeekHours.has(memberId)) {
      memberWeekHours.set(memberId, new Map());
    }

    const currentHours = memberWeekHours.get(memberId)!.get(weekKey) || 0;
    memberWeekHours.get(memberId)!.set(weekKey, currentHours + hours);
  }

  // Update result
  memberWeekHours.forEach((weekMap, memberId) => {
    if (!result[memberId]) {
      result[memberId] = {};
    }

    weekMap.forEach((totalHours, weekKey) => {
      if (!result[memberId][weekKey]) {
        result[memberId][weekKey] = {
          projectHours: 0,
          annualLeave: 0,
          officeHolidays: 0,
          otherLeave: 0,
          total: 0,
          projects: []
        };
      }

      result[memberId][weekKey].otherLeave = totalHours;
      
      // Recalculate total
      const breakdown = result[memberId][weekKey];
      breakdown.total = breakdown.projectHours + breakdown.annualLeave + breakdown.officeHolidays + breakdown.otherLeave;
    });
  });
};
