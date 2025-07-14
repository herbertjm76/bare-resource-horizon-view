import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';

export const fetchProjectAllocations = async (
  companyId: string,
  memberIds: string[],
  startDate: Date,
  endDate: Date
) => {
  const startDateStr = format(startDate, 'yyyy-MM-dd');
  const endDateStr = format(endDate, 'yyyy-MM-dd');
  
  console.log('🚨🚨🚨 CRITICAL DEBUG - FETCHING PROJECT ALLOCATIONS 🚨🚨🚨');
  console.log('🔍 FETCHING PROJECT ALLOCATIONS:', {
    companyId,
    memberIds: memberIds.slice(0, 3),
    startDate: startDateStr,
    endDate: endDateStr,
    dateRange: `${startDateStr} to ${endDateStr}`
  });

  const result = await supabase
    .from('project_resource_allocations')
    .select(`
      resource_id,
      project_id,
      hours,
      week_start_date,
      resource_type,
      projects!inner(id, name, code)
    `)
    .eq('company_id', companyId)
    .in('resource_id', memberIds)
    .gte('week_start_date', startDateStr)
    .lte('week_start_date', endDateStr)
    .gt('hours', 0);

  console.log('🔍 PROJECT ALLOCATIONS RESULT:', {
    totalRecords: result.data?.length || 0,
    error: result.error,
    robNightRecords: result.data?.filter(r => r.resource_id === 'fc351fa0-b6df-447a-bc27-b6675db2622e').length || 0,
    sampleRecords: result.data?.slice(0, 3).map(r => ({
      resource_id: r.resource_id,
      project_id: r.project_id,
      hours: r.hours,
      week_start_date: r.week_start_date
    })) || []
  });

  // Log Rob Night's specific records
  const robNightRecords = result.data?.filter(r => r.resource_id === 'fc351fa0-b6df-447a-bc27-b6675db2622e') || [];
  if (robNightRecords.length > 0) {
    console.log('🔍 ROB NIGHT ALLOCATION RECORDS FETCHED:', {
      totalRecords: robNightRecords.length,
      records: robNightRecords.map(r => ({
        project_id: r.project_id,
        project_name: r.projects?.name,
        hours: r.hours,
        week_start_date: r.week_start_date
      }))
    });
  }

  return result;
};

export const fetchAnnualLeaves = async (
  companyId: string,
  memberIds: string[],
  startDate: Date,
  endDate: Date
) => {
  return supabase
    .from('annual_leaves')
    .select('member_id, date, hours')
    .eq('company_id', companyId)
    .in('member_id', memberIds)
    .gte('date', format(startDate, 'yyyy-MM-dd'))
    .lte('date', format(endDate, 'yyyy-MM-dd'));
};

export const fetchOtherLeaves = async (
  companyId: string,
  memberIds: string[],
  startDate: Date,
  endDate: Date
) => {
  return supabase
    .from('weekly_other_leave')
    .select('member_id, week_start_date, hours')
    .eq('company_id', companyId)
    .in('member_id', memberIds)
    .gte('week_start_date', format(startDate, 'yyyy-MM-dd'))
    .lte('week_start_date', format(endDate, 'yyyy-MM-dd'));
};