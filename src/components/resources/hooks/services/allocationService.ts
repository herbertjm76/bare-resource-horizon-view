
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { ProjectAllocations } from '../types/resourceTypes';
import { getAllocationKey } from '../utils/allocationUtils';
import { logger } from '@/utils/logger';
import { getWeekStartDate } from '@/hooks/allocations/utils/dateUtils';
import { toUTCDateKey } from '@/utils/dateKey';

export const initializeAllocations = async (
  projectId: string,
  companyId: string
): Promise<ProjectAllocations> => {
  try {
    logger.debug('initializeAllocations - Starting', { projectId, companyId });
    
    // Fetch all resource allocations for this project from database
    const { data, error } = await supabase
      .from('project_resource_allocations')
      .select('resource_id, allocation_date, hours')
      .eq('project_id', projectId)
      .eq('company_id', companyId);
      
    if (error) {
      logger.error('initializeAllocations - Database error', error);
      toast.error('Failed to load resource allocations');
      return {};
    }
    
    logger.debug('initializeAllocations - Fetched allocations', { count: data?.length || 0 });
    
    // Transform the data into our allocation structure
    // IMPORTANT: Normalize all allocation dates to Monday of their week for consistent lookups
    const initialAllocations: ProjectAllocations = {};
    
    data?.forEach(allocation => {
      // Parse the allocation date and normalize to Monday of that week
      const allocationDate = new Date(allocation.allocation_date + 'T00:00:00Z');
      const mondayDate = getWeekStartDate(allocationDate);
      const weekKey = toUTCDateKey(mondayDate);
      
      const resourceId = allocation.resource_id;
      const allocationKey = getAllocationKey(resourceId, weekKey);
      const hours = allocation.hours;
      // Aggregate hours for the same week (in case of multiple allocations)
      initialAllocations[allocationKey] = (initialAllocations[allocationKey] || 0) + hours;
    });
    
    logger.debug('initializeAllocations - Complete', { totalKeys: Object.keys(initialAllocations).length });
    return initialAllocations;
    
  } catch (err) {
    console.error('Error in initializeAllocations:', err);
    toast.error('Failed to load resource allocations');
    return {};
  }
};

export const checkResourceInOtherProjects = async (
  resourceId: string,
  resourceType: 'active' | 'pre_registered',
  projectId: string,
  companyId: string
) => {
  try {
    const { data, error } = await supabase
      .from('project_resource_allocations')
      .select('project_id')
      .eq('resource_id', resourceId)
      .eq('resource_type', resourceType)
      .eq('company_id', companyId)
      .neq('project_id', projectId);
      
    if (error) {
      console.error('Error checking other project allocations:', error);
      return { hasOtherAllocations: false, projectCount: 0 };
    }
    
    const uniqueProjects = new Set(data?.map(d => d.project_id) || []);
    return { 
      hasOtherAllocations: uniqueProjects.size > 0, 
      projectCount: uniqueProjects.size 
    };
  } catch (error) {
    console.error('Error in checkResourceInOtherProjects:', error);
    return { hasOtherAllocations: false, projectCount: 0 };
  }
};
