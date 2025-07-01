
import { supabase } from '@/integrations/supabase/client';
import { WorkloadDataParams, ProcessedWorkloadResult } from '../types';
import { format, startOfWeek, isWithinInterval, addDays } from 'date-fns';

export const fetchAnnualLeave = async (params: WorkloadDataParams) => {
  const { companyId, memberIds, startDate, numberOfWeeks } = params;
  
  // Calculate the full date range for the period
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + (numberOfWeeks * 7) - 1); // Last day of the period
  
  const { data, error } = await supabase
    .from('annual_leaves')
    .select('member_id, date, hours')
    .eq('company_id', companyId)
    .in('member_id', memberIds)
    .gte('date', format(startDate, 'yyyy-MM-dd'))
    .lte('date', format(endDate, 'yyyy-MM-dd'));

  if (error) {
    console.error('Error fetching annual leave:', error);
    throw error;
  }

  return data || [];
};

export const processAnnualLeave = (
  annualLeaves: any[],
  result: ProcessedWorkloadResult
) => {
  if (annualLeaves.length === 0) return;

  // Use Map for faster aggregation
  const memberWeekHours = new Map<string, Map<string, number>>();

  // Single pass aggregation
  for (const leave of annualLeaves) {
    const memberId = leave.member_id;
    const leaveDate = new Date(leave.date);
    const hours = parseFloat(leave.hours) || 0;
    const weekStart = startOfWeek(leaveDate, { weekStartsOn: 1 });
    const weekKey = format(weekStart, 'yyyy-MM-dd');

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

      result[memberId][weekKey].annualLeave = totalHours;
      
      // Recalculate total
      const breakdown = result[memberId][weekKey];
      breakdown.total = breakdown.projectHours + breakdown.annualLeave + breakdown.officeHolidays + breakdown.otherLeave;
    });
  });
};
