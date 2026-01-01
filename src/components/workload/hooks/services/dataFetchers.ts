import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';
import { DEMO_COMPANY_ID, generateDemoAllocations, generateDemoAnnualLeaves, DEMO_PROJECTS } from '@/data/demoData';

// Check if we're in demo mode
const isDemoMode = () => {
  return localStorage.getItem('demoMode') === 'true';
};

export const fetchProjectAllocations = async (
  companyId: string,
  memberIds: string[],
  startDate: Date,
  endDate: Date
) => {
  const startDateStr = format(startDate, 'yyyy-MM-dd');
  const endDateStr = format(endDate, 'yyyy-MM-dd');
  
  // Return demo data if in demo mode
  if (isDemoMode() || companyId === DEMO_COMPANY_ID) {
    const demoAllocations = generateDemoAllocations();
    
    // Filter allocations by date range and member IDs
    const filteredAllocations = demoAllocations
      .filter(alloc => 
        memberIds.includes(alloc.resource_id) &&
        alloc.allocation_date >= startDateStr &&
        alloc.allocation_date <= endDateStr &&
        alloc.hours > 0
      )
      .map(alloc => {
        const project = DEMO_PROJECTS.find(p => p.id === alloc.project_id);
        return {
          ...alloc,
          projects: project ? { id: project.id, name: project.name, code: project.code } : null
        };
      });
    
    logger.log('🔍 DEMO PROJECT ALLOCATIONS:', {
      totalRecords: filteredAllocations.length,
      dateRange: `${startDateStr} to ${endDateStr}`
    });
    
    return { data: filteredAllocations, error: null };
  }
  
  logger.log('🚨🚨🚨 CRITICAL DEBUG - FETCHING PROJECT ALLOCATIONS 🚨🚨🚨');
  logger.log('🔍 FETCHING PROJECT ALLOCATIONS:', {
    companyId,
    memberIds: memberIds.slice(0, 3),
    startDate: startDateStr,
    endDate: endDateStr,
    dateRange: `${startDateStr} to ${endDateStr}`
  });

  // Fetch regular allocations within the requested date range to avoid hitting default row limits
  const result = await supabase
    .from('project_resource_allocations')
    .select(`
      resource_id,
      project_id,
      hours,
      allocation_date,
      resource_type,
      projects!inner(id, name, code)
    `)
    .eq('company_id', companyId)
    .in('resource_id', memberIds)
    .gt('hours', 0)
    .gte('allocation_date', startDateStr)
    .lte('allocation_date', endDateStr)
    .order('allocation_date', { ascending: true });

  const paulJuliusRecords = result.data?.filter(r => r.resource_id === 'b06b0c9d-70c5-49cd-aae9-fcf9016ebe82') || [];
  const paulOct13Records = paulJuliusRecords.filter(r => r.allocation_date >= '2025-10-13' && r.allocation_date <= '2025-10-19');
  
  logger.log('🔍 PROJECT ALLOCATIONS RESULT (ALL RECORDS):', {
    totalRecords: result.data?.length || 0,
    error: result.error,
    paulJuliusRecords: paulJuliusRecords.length,
    paulJuliusOct13Week: paulOct13Records.length,
    paulJuliusOct13Details: paulOct13Records.map(r => ({
      date: r.allocation_date,
      hours: r.hours,
      project: r.projects?.name
    })),
    robNightRecords: result.data?.filter(r => r.resource_id === 'fc351fa0-b6df-447a-bc27-b6675db2622e').length || 0,
    dateRange: result.data ? `${result.data[0]?.allocation_date} to ${result.data[result.data.length - 1]?.allocation_date}` : 'none'
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

  logger.log('🔍 PENDING RESOURCE ALLOCATIONS:', {
    totalRecords: pendingResult.data?.length || 0,
    error: pendingResult.error
  });

  return { 
    ...result, 
    data: [...(result.data || []), ...(pendingResult.data || []).map(pr => ({
      resource_id: pr.invite_id,
      project_id: pr.project_id,
      hours: pr.hours,
      allocation_date: startDateStr, // Use start date as placeholder for pending resources
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
  // Return demo data if in demo mode
  if (isDemoMode() || companyId === DEMO_COMPANY_ID) {
    const demoLeaves = generateDemoAnnualLeaves();
    
    const filteredLeaves = demoLeaves.filter(leave => 
      memberIds.includes(leave.member_id)
    );
    
    logger.log('🔍 DEMO ANNUAL LEAVES:', {
      totalRecords: filteredLeaves.length
    });
    
    return { data: filteredLeaves, error: null };
  }
  
  logger.log('🔍 FETCHING ANNUAL LEAVES - FIXED VERSION');
  
  // FIX: Remove restrictive date filtering - fetch ALL leaves and let frontend filter
  const result = await supabase
    .from('annual_leaves')
    .select('member_id, date, hours')
    .eq('company_id', companyId)
    .in('member_id', memberIds)
    .order('date', { ascending: true });

  logger.log('🔍 ANNUAL LEAVES RESULT (ALL RECORDS):', {
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
  // Return empty array for demo mode (no other leaves in demo)
  if (isDemoMode() || companyId === DEMO_COMPANY_ID) {
    logger.log('🔍 DEMO OTHER LEAVES: []');
    return { data: [], error: null };
  }
  
  logger.log('🔍 FETCHING OTHER LEAVES - FIXED VERSION');
  
  // FIX: Remove restrictive date filtering - fetch ALL other leaves and let frontend filter
  const result = await supabase
    .from('weekly_other_leave')
    .select('member_id, week_start_date, hours')
    .eq('company_id', companyId)
    .in('member_id', memberIds)
    .order('week_start_date', { ascending: true });

  logger.log('🔍 OTHER LEAVES RESULT (ALL RECORDS):', {
    totalRecords: result.data?.length || 0,
    error: result.error,
    dateRange: result.data?.length ? `${result.data[0]?.week_start_date} to ${result.data[result.data.length - 1]?.week_start_date}` : 'none'
  });

  return result;
};
