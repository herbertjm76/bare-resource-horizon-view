
import { supabase } from '@/integrations/supabase/client';
import { getWeekStartOptions, getWeekDateRange } from './dateUtils';
import { toast } from 'sonner';

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
  
  console.log('Looking for allocations with Monday date:', mondayKey);
  console.log('Or Sunday date:', sundayKey);
  
  // Try to fetch allocations with either Monday OR Sunday as the week_start_date
  try {
    const { data, error } = await supabase
      .from('project_resource_allocations')
      .select(`
        id,
        resource_id,
        hours,
        week_start_date,
        project:projects(id, name, code)
      `)
      .or(`week_start_date.eq.${mondayKey},week_start_date.eq.${sundayKey}`)
      .eq('company_id', companyId)
      .in('resource_id', memberIds);
    
    if (error) {
      console.error('Error fetching project allocations:', error);
      return [];
    }
    
    console.log(`Found ${data?.length || 0} allocations with exact date match`);
    return data || [];
  } catch (err) {
    console.error('Error in fetchPreciseDateAllocations:', err);
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
    
    console.log(`Trying date range query from ${startDateString} to ${endDateString}`);
    
    const { data, error } = await supabase
      .from('project_resource_allocations')
      .select(`
        id,
        resource_id,
        hours,
        week_start_date,
        project:projects(id, name, code)
      `)
      .gte('week_start_date', startDateString)
      .lte('week_start_date', endDateString)
      .eq('company_id', companyId)
      .in('resource_id', memberIds);
      
    if (error) {
      console.error('Error in date range query:', error);
      return [];
    }
    
    console.log(`Found ${data?.length || 0} allocations with date range query`);
    return data || [];
  } catch (err) {
    console.error('Error in fetchDateRangeAllocations:', err);
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
      .select('week_start_date')
      .eq('company_id', companyId)
      .order('week_start_date', { ascending: false })
      .limit(10);
      
    if (!dateData || dateData.length === 0) {
      return [];
    }
    
    // Get unique dates for debugging
    const uniqueDates = [...new Set(dateData.map(item => item.week_start_date))];
    console.log('Recent allocation dates in DB:', uniqueDates);
    
    // Try fetching with the most recent date
    const latestDate = uniqueDates[0];
    console.log(`Trying to fetch with most recent date: ${latestDate}`);
    
    const { data } = await supabase
      .from('project_resource_allocations')
      .select(`
        id,
        resource_id,
        hours,
        week_start_date,
        project:projects(id, name, code)
      `)
      .eq('week_start_date', latestDate)
      .eq('company_id', companyId)
      .in('resource_id', memberIds);
      
    console.log(`Found ${data?.length || 0} allocations using latest date: ${latestDate}`);
    return data || [];
  } catch (err) {
    console.error('Error in fetchRecentAllocations:', err);
    return [];
  }
}
