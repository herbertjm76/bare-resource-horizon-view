import { supabase } from '@/integrations/supabase/client';
import { format, endOfWeek } from 'date-fns';
import { WeekStartDate } from '../types/weeklyWorkloadTypes';

export interface WorkloadRawData {
  allocations: any[] | null;
  leave: any[] | null;
  holidays: any[] | null;
  otherLeave: any[] | null;
}

export const fetchWorkloadData = async (
  companyId: string,
  memberIds: string[],
  weekStartDates: WeekStartDate[]
): Promise<WorkloadRawData> => {
  console.log('🔍 WEEKLY WORKLOAD: Starting comprehensive data fetch...');
  
  const startDate = weekStartDates[0]?.key;
  const endWeek = weekStartDates[weekStartDates.length - 1];
  const endDate = endWeek ? format(endOfWeek(endWeek.date, { weekStartsOn: 1 }), 'yyyy-MM-dd') : startDate;

  // Fetch all data in parallel
  const [allocationsResult, leaveResult, holidaysResult, otherLeaveResult] = await Promise.all([
    // Project allocations
    supabase
      .from('project_resource_allocations')
      .select(`
        resource_id,
        week_start_date,
        hours,
        projects (
          id,
          name,
          current_stage
        )
      `)
      .eq('company_id', companyId)
      .in('resource_id', memberIds)
      .in('week_start_date', weekStartDates.map(w => w.key)),

    // Annual leave
    supabase
      .from('annual_leaves')
      .select('member_id, date, hours')
      .eq('company_id', companyId)
      .in('member_id', memberIds)
      .gte('date', startDate)
      .lte('date', endDate),

    // Office holidays
    supabase
      .from('office_holidays')
      .select('date, end_date, name, location_id')
      .eq('company_id', companyId)
      .gte('date', startDate)
      .lte('date', endDate),

    // Other leave
    supabase
      .from('weekly_other_leave')
      .select('member_id, week_start_date, hours, leave_type')
      .eq('company_id', companyId)
      .in('member_id', memberIds)
      .in('week_start_date', weekStartDates.map(w => w.key))
  ]);

  console.log('🔍 WEEKLY WORKLOAD: Raw data fetched:', {
    allocations: allocationsResult.data?.length || 0,
    leave: leaveResult.data?.length || 0,
    holidays: holidaysResult.data?.length || 0,
    otherLeave: otherLeaveResult.data?.length || 0
  });

  return {
    allocations: allocationsResult.data,
    leave: leaveResult.data,
    holidays: holidaysResult.data,
    otherLeave: otherLeaveResult.data
  };
};
