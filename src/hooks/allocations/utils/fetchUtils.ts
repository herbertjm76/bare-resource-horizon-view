
import { supabase } from '@/integrations/supabase/client';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import { toast } from 'sonner';
import { logger } from '@/utils/logger';

// Local helpers for legacy fetch utilities (always use Monday for backward compatibility)
const getWeekStartOptions = (selectedWeek: Date) => {
  const monday = startOfWeek(selectedWeek, { weekStartsOn: 1 });
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() - 1);
  return { 
    monday, 
    sunday, 
    mondayKey: format(monday, 'yyyy-MM-dd'), 
    sundayKey: format(sunday, 'yyyy-MM-dd') 
  };
};

const getWeekDateRange = (selectedWeek: Date) => {
  const startDate = startOfWeek(selectedWeek, { weekStartsOn: 1 });
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);
  return { 
    startDate, 
    endDate, 
    startDateString: format(startDate, 'yyyy-MM-dd'), 
    endDateString: format(endDate, 'yyyy-MM-dd') 
  };
};

/**
 * Fetch project allocations from the database with precise date matching
 */
export async function fetchPreciseDateAllocations(
  memberIds: string[],
  selectedWeek: Date,
  companyId: string | undefined
) {
  if (!companyId) return [];
  
  // Get both Monday and Sunday dates for the selected week
  const { mondayKey, sundayKey } = getWeekStartOptions(selectedWeek);
  
  logger.log('Looking for allocations with Monday date:', mondayKey);
  logger.log('Or Sunday date:', sundayKey);
  
  // Try to fetch allocations with either Monday OR Sunday as the week_start_date
  try {
    const { data, error } = await supabase
      .from('project_resource_allocations')
      .select(`
        id,
        resource_id,
        hours,
        allocation_date,
        project:projects(id, name, code)
      `)
      .or(`allocation_date.eq.${mondayKey},allocation_date.eq.${sundayKey}`)
      .eq('company_id', companyId)
      .in('resource_id', memberIds);
    
    if (error) {
      logger.error('Error fetching project allocations:', error);
      return [];
    }
    
    logger.log(`Found ${data?.length || 0} allocations with exact date match`);
    return data || [];
  } catch (err) {
    logger.error('Error in fetchPreciseDateAllocations:', err);
    return [];
  }
}

/**
 * Fetch project allocations using a date range when precise matching fails
 */
export async function fetchDateRangeAllocations(
  memberIds: string[],
  selectedWeek: Date,
  companyId: string | undefined
) {
  if (!companyId) return [];
  
  try {
    // Get the range for the entire week
    const { startDateString, endDateString } = getWeekDateRange(selectedWeek);
    
    logger.log(`Trying date range query from ${startDateString} to ${endDateString}`);
    
    const { data, error } = await supabase
      .from('project_resource_allocations')
      .select(`
        id,
        resource_id,
        hours,
        allocation_date,
        project:projects(id, name, code)
      `)
      .gte('allocation_date', startDateString)
      .lte('allocation_date', endDateString)
      .eq('company_id', companyId)
      .in('resource_id', memberIds);
      
    if (error) {
      logger.error('Error in date range query:', error);
      return [];
    }
    
    logger.log(`Found ${data?.length || 0} allocations with date range query`);
    return data || [];
  } catch (err) {
    logger.error('Error in fetchDateRangeAllocations:', err);
    return [];
  }
}

/**
 * Fetch most recent allocations as a fallback
 */
export async function fetchRecentAllocations(
  memberIds: string[],
  companyId: string | undefined
) {
  if (!companyId) return [];
  
  try {
    // First fetch recent dates
    const { data: dateData } = await supabase
      .from('project_resource_allocations')
      .select('allocation_date')
      .eq('company_id', companyId)
      .order('allocation_date', { ascending: false })
      .limit(10);
      
    if (!dateData || dateData.length === 0) {
      return [];
    }
    
    // Get unique dates for debugging
    const uniqueDates = [...new Set(dateData.map(item => item.allocation_date))];
    logger.log('Recent allocation dates in DB:', uniqueDates);
    
    // Try fetching with the most recent date
    const latestDate = uniqueDates[0];
    logger.log(`Trying to fetch with most recent date: ${latestDate}`);
    
    const { data } = await supabase
      .from('project_resource_allocations')
      .select(`
        id,
        resource_id,
        hours,
        allocation_date,
        project:projects(id, name, code)
      `)
      .eq('allocation_date', latestDate)
      .eq('company_id', companyId)
      .in('resource_id', memberIds);
      
    logger.log(`Found ${data?.length || 0} allocations using latest date: ${latestDate}`);
    return data || [];
  } catch (err) {
    logger.error('Error in fetchRecentAllocations:', err);
    return [];
  }
}
