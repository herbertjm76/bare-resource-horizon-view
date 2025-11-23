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

  // Fetch regular allocations
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
    .gt('hours', 0)
    .order('week_start_date', { ascending: true });

  console.log('🔍 PROJECT ALLOCATIONS RESULT (ALL RECORDS):', {
    totalRecords: result.data?.length || 0,
    error: result.error,
    robNightRecords: result.data?.filter(r => r.resource_id === 'fc351fa0-b6df-447a-bc27-b6675db2622e').length || 0,
    dateRange: result.data ? `${result.data[0]?.week_start_date} to ${result.data[result.data.length - 1]?.week_start_date}` : 'none'
  });

  // Also fetch pending resource allocations for pre-registered members
  const pendingResult = await supabase
    .from('pending_resources')
    .select(`
      invite_id,
      project_id,
      hours,
      projects!inner(id, name, code)
    `)
    .eq('company_id', companyId)
    .in('invite_id', memberIds)
    .gt('hours', 0);

  console.log('🔍 PENDING RESOURCE ALLOCATIONS:', {
    totalRecords: pendingResult.data?.length || 0,
    error: pendingResult.error
  });

  return { 
    ...result, 
    data: [...(result.data || []), ...(pendingResult.data || []).map(pr => ({
      resource_id: pr.invite_id,
      project_id: pr.project_id,
      hours: pr.hours,
      week_start_date: startDateStr, // Use start date as placeholder for pending resources
      resource_type: 'pending',
      projects: pr.projects
    }))]
  };
};

export const fetchAnnualLeaves = async (
  companyId: string,
  memberIds: string[],
  startDate: Date,
  endDate: Date
) => {
  console.log('🔍 FETCHING ANNUAL LEAVES - FIXED VERSION');
  
  // FIX: Remove restrictive date filtering - fetch ALL leaves and let frontend filter
  const result = await supabase
    .from('annual_leaves')
    .select('member_id, date, hours')
    .eq('company_id', companyId)
    .in('member_id', memberIds)
    .order('date', { ascending: true });

  console.log('🔍 ANNUAL LEAVES RESULT (ALL RECORDS):', {
    totalRecords: result.data?.length || 0,
    error: result.error,
    dateRange: result.data?.length ? `${result.data[0]?.date} to ${result.data[result.data.length - 1]?.date}` : 'none'
  });

  return result;
};

export const fetchOtherLeaves = async (
  companyId: string,
  memberIds: string[],
  startDate: Date,
  endDate: Date
) => {
  console.log('🔍 FETCHING OTHER LEAVES - FIXED VERSION');
  
  // FIX: Remove restrictive date filtering - fetch ALL other leaves and let frontend filter
  const result = await supabase
    .from('weekly_other_leave')
    .select('member_id, week_start_date, hours')
    .eq('company_id', companyId)
    .in('member_id', memberIds)
    .order('week_start_date', { ascending: true });

  console.log('🔍 OTHER LEAVES RESULT (ALL RECORDS):', {
    totalRecords: result.data?.length || 0,
    error: result.error,
    dateRange: result.data?.length ? `${result.data[0]?.week_start_date} to ${result.data[result.data.length - 1]?.week_start_date}` : 'none'
  });

  return result;
};