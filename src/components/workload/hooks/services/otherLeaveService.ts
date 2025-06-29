
import { supabase } from '@/integrations/supabase/client';
import { WorkloadDataParams, ProcessedWorkloadResult } from '../types';
import { format, startOfWeek } from 'date-fns';

export const fetchOtherLeave = async (params: WorkloadDataParams) => {
  const { companyId, memberIds, startDate, numberOfWeeks } = params;
  
  // Calculate the end date for the period
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + (numberOfWeeks * 7));
  
  console.log('Fetching other leave:', {
    companyId,
    memberIds: memberIds.length,
    startDate: format(startDate, 'yyyy-MM-dd'),
    endDate: format(endDate, 'yyyy-MM-dd')
  });

  const { data, error } = await supabase
    .from('weekly_other_leave')
    .select('*')
    .eq('company_id', companyId)
    .in('member_id', memberIds)
    .gte('week_start_date', format(startDate, 'yyyy-MM-dd'))
    .lt('week_start_date', format(endDate, 'yyyy-MM-dd'));

  if (error) {
    console.error('Error fetching other leave:', error);
    throw error;
  }

  console.log('Fetched other leave entries:', data?.length || 0);
  return data || [];
};

export const processOtherLeave = (
  otherLeaves: any[],
  result: ProcessedWorkloadResult
) => {
  console.log('Processing other leave entries:', otherLeaves.length);
  
  // Group other leave by member and week
  const leaveByMemberWeek = new Map<string, Map<string, number>>();

  otherLeaves.forEach(leave => {
    const memberId = leave.member_id;
    const weekStartDate = new Date(leave.week_start_date);
    const weekKey = format(weekStartDate, 'yyyy-MM-dd');
    const hours = parseFloat(leave.hours) || 0;

    // Initialize member map if it doesn't exist
    if (!leaveByMemberWeek.has(memberId)) {
      leaveByMemberWeek.set(memberId, new Map());
    }

    const memberWeekMap = leaveByMemberWeek.get(memberId)!;
    const currentHours = memberWeekMap.get(weekKey) || 0;
    memberWeekMap.set(weekKey, currentHours + hours);

    console.log(`Processing other leave - Member: ${memberId}, Week: ${weekKey}, Hours: ${hours}, Total for week: ${memberWeekMap.get(weekKey)}`);
  });

  // Update the result with processed other leave data
  leaveByMemberWeek.forEach((weekMap, memberId) => {
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

      // Update other leave hours
      result[memberId][weekKey].otherLeave = totalHours;
      
      // Recalculate total
      const breakdown = result[memberId][weekKey];
      breakdown.total = breakdown.projectHours + breakdown.annualLeave + breakdown.officeHolidays + breakdown.otherLeave;

      console.log(`Updated other leave for ${memberId}, week ${weekKey}:`, {
        otherLeave: breakdown.otherLeave,
        total: breakdown.total
      });
    });
  });

  console.log('Finished processing other leave. Updated members:', Object.keys(result).length);
};
