
import { supabase } from '@/integrations/supabase/client';
import { WorkloadDataParams, ProcessedWorkloadResult } from '../types';
import { format, startOfWeek, isWithinInterval, addDays } from 'date-fns';

export const fetchAnnualLeave = async (params: WorkloadDataParams) => {
  const { companyId, memberIds, startDate, numberOfWeeks } = params;
  
  // Calculate the full date range for the period
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + (numberOfWeeks * 7) - 1); // Last day of the period
  
  console.log('Fetching annual leave:', {
    companyId,
    memberIds: memberIds.length,
    startDate: format(startDate, 'yyyy-MM-dd'),
    endDate: format(endDate, 'yyyy-MM-dd')
  });

  const { data, error } = await supabase
    .from('annual_leaves')
    .select('*')
    .eq('company_id', companyId)
    .in('member_id', memberIds)
    .gte('date', format(startDate, 'yyyy-MM-dd'))
    .lte('date', format(endDate, 'yyyy-MM-dd'));

  if (error) {
    console.error('Error fetching annual leave:', error);
    throw error;
  }

  console.log('Fetched annual leave entries:', data?.length || 0);
  return data || [];
};

export const processAnnualLeave = (
  annualLeaves: any[],
  result: ProcessedWorkloadResult
) => {
  console.log('Processing annual leave entries:', annualLeaves.length);
  
  // Group annual leave by member and week
  const leaveByMemberWeek = new Map<string, Map<string, number>>();

  annualLeaves.forEach(leave => {
    const memberId = leave.member_id;
    const leaveDate = new Date(leave.date);
    const hours = parseFloat(leave.hours) || 0;
    
    // Find the Monday of the week containing this leave date
    const weekStart = startOfWeek(leaveDate, { weekStartsOn: 1 });
    const weekKey = format(weekStart, 'yyyy-MM-dd');

    // Initialize member map if it doesn't exist
    if (!leaveByMemberWeek.has(memberId)) {
      leaveByMemberWeek.set(memberId, new Map());
    }

    const memberWeekMap = leaveByMemberWeek.get(memberId)!;
    const currentHours = memberWeekMap.get(weekKey) || 0;
    memberWeekMap.set(weekKey, currentHours + hours);

    console.log(`Processing annual leave - Member: ${memberId}, Date: ${format(leaveDate, 'yyyy-MM-dd')}, Week: ${weekKey}, Hours: ${hours}, Total for week: ${memberWeekMap.get(weekKey)}`);
  });

  // Update the result with processed annual leave data
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

      // Update annual leave hours
      result[memberId][weekKey].annualLeave = totalHours;
      
      // Recalculate total
      const breakdown = result[memberId][weekKey];
      breakdown.total = breakdown.projectHours + breakdown.annualLeave + breakdown.officeHolidays + breakdown.otherLeave;

      console.log(`Updated annual leave for ${memberId}, week ${weekKey}:`, {
        annualLeave: breakdown.annualLeave,
        total: breakdown.total
      });
    });
  });

  console.log('Finished processing annual leave. Updated members:', Object.keys(result).length);
};
