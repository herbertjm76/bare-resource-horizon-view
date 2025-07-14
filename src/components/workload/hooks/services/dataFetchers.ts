import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';

export const fetchProjectAllocations = async (
  companyId: string,
  memberIds: string[],
  startDate: Date,
  endDate: Date
) => {
  return supabase
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
    .gte('week_start_date', format(startDate, 'yyyy-MM-dd'))
    .lte('week_start_date', format(endDate, 'yyyy-MM-dd'))
    .gt('hours', 0);
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