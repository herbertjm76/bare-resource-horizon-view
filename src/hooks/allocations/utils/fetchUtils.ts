/**
 * Fetch Utilities - RULEBOOK COMPLIANT
 * 
 * Uses the canonical allocationWeek module for all week key operations.
 * Simplified: no more Monday/Sunday probing since DB now enforces normalization.
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';
import { 
  getAllocationWeekKey, 
  getWeekRange,
  type WeekStartDay 
} from '@/utils/allocationWeek';

/**
 * Fetch project allocations from the database with exact week key matching.
 * 
 * Since DB triggers now enforce normalized week keys, we only need to query
 * by the exact canonical week key - no more probing for Monday/Sunday variants.
 * 
 * @param memberIds - Array of member/resource IDs
 * @param selectedWeek - The week to fetch (any date within the week)
 * @param companyId - Company ID for scoping
 * @param weekStartDay - Company's week start preference
 */
export async function fetchPreciseDateAllocations(
  memberIds: string[],
  selectedWeek: Date,
  companyId: string | undefined,
  weekStartDay: WeekStartDay = 'Monday'
) {
  if (!companyId || memberIds.length === 0) return [];
  
  // Get the canonical week key
  const weekKey = getAllocationWeekKey(selectedWeek, weekStartDay);
  
  logger.log('Fetching allocations for week key:', weekKey);
  
  try {
    // RULE BOOK: Weekly overview shows ACTIVE team members only.
    // Filter by resource_type='active' to avoid double-counting legacy/pre_registered rows.
    const { data, error } = await supabase
      .from('project_resource_allocations')
      .select(`
        id,
        resource_id,
        hours,
        allocation_date,
        project:projects(id, name, code)
      `)
      .eq('allocation_date', weekKey)
      .eq('company_id', companyId)
      .eq('resource_type', 'active')
      .in('resource_id', memberIds);
    
    if (error) {
      logger.error('Error fetching project allocations:', error);
      return [];
    }
    
    logger.log(`Found ${data?.length || 0} allocations for week ${weekKey}`);
    return data || [];
  } catch (err) {
    logger.error('Error in fetchPreciseDateAllocations:', err);
    return [];
  }
}

/**
 * Fetch project allocations using a date range.
 * Useful for multi-week views (workload, reports).
 * 
 * @param memberIds - Array of member/resource IDs
 * @param startWeekKey - Start week key (YYYY-MM-DD, must be week start)
 * @param endWeekKey - End week key (YYYY-MM-DD, must be week start)
 * @param companyId - Company ID for scoping
 */
export async function fetchDateRangeAllocations(
  memberIds: string[],
  startWeekKey: string,
  endWeekKey: string,
  companyId: string | undefined
) {
  if (!companyId || memberIds.length === 0) return [];
  
  logger.log(`Fetching allocations from ${startWeekKey} to ${endWeekKey}`);
  
  try {
    // RULE BOOK: Weekly overview shows ACTIVE team members only.
    // Filter by resource_type='active' to avoid double-counting legacy/pre_registered rows.
    const { data, error } = await supabase
      .from('project_resource_allocations')
      .select(`
        id,
        resource_id,
        hours,
        allocation_date,
        project:projects(id, name, code)
      `)
      .gte('allocation_date', startWeekKey)
      .lte('allocation_date', endWeekKey)
      .eq('company_id', companyId)
      .eq('resource_type', 'active')
      .in('resource_id', memberIds);
      
    if (error) {
      logger.error('Error in date range query:', error);
      return [];
    }
    
    logger.log(`Found ${data?.length || 0} allocations in range`);
    return data || [];
  } catch (err) {
    logger.error('Error in fetchDateRangeAllocations:', err);
    return [];
  }
}

/**
 * @deprecated - No longer needed since DB enforces normalized week keys.
 * Kept for backward compatibility but should be removed in future cleanup.
 */
export async function fetchRecentAllocations(
  memberIds: string[],
  companyId: string | undefined
) {
  logger.warn('fetchRecentAllocations is deprecated - use fetchPreciseDateAllocations instead');
  
  if (!companyId || memberIds.length === 0) return [];
  
  try {
    // Fetch the most recent week key in the database
    const { data: dateData } = await supabase
      .from('project_resource_allocations')
      .select('allocation_date')
      .eq('company_id', companyId)
      .order('allocation_date', { ascending: false })
      .limit(1);
      
    if (!dateData || dateData.length === 0) {
      return [];
    }
    
    const latestWeekKey = dateData[0].allocation_date;
    logger.log(`Using most recent week key: ${latestWeekKey}`);
    
    // RULEBOOK: Filter by resource_type='active' for active team views
    const { data } = await supabase
      .from('project_resource_allocations')
      .select(`
        id,
        resource_id,
        hours,
        allocation_date,
        project:projects(id, name, code)
      `)
      .eq('allocation_date', latestWeekKey)
      .eq('company_id', companyId)
      .eq('resource_type', 'active')
      .in('resource_id', memberIds);
      
    return data || [];
  } catch (err) {
    logger.error('Error in fetchRecentAllocations:', err);
    return [];
  }
}
