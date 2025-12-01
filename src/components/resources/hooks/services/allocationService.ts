
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { ProjectAllocations } from '../types/resourceTypes';
import { getAllocationKey } from '../utils/allocationUtils';
import { startOfWeek, parseISO, format } from 'date-fns';

export const initializeAllocations = async (
  projectId: string,
  companyId: string
): Promise<ProjectAllocations> => {
  try {
    console.log('DEBUG initializeAllocations - Starting for project:', projectId, 'company:', companyId);
    console.log('DEBUG initializeAllocations - About to query project_resource_allocations table');
    
    // Fetch all resource allocations for this project from database
    const { data, error } = await supabase
      .from('project_resource_allocations')
      .select('resource_id, allocation_date, hours')
      .eq('project_id', projectId)
      .eq('company_id', companyId);
      
    if (error) {
      console.error('DEBUG initializeAllocations - Database error:', error);
      toast.error('Failed to load resource allocations');
      return {};
    }
    
    console.log('DEBUG initializeAllocations - Raw data from database:', data);
    console.log('DEBUG initializeAllocations - Fetched allocations count:', data?.length || 0);
    
    // Transform the data into our allocation structure
    // Convert individual dates to week start dates (Monday) and aggregate hours
    const initialAllocations: ProjectAllocations = {};
    
    data?.forEach(allocation => {
      // Convert allocation_date to week start date (Monday)
      const allocationDate = parseISO(allocation.allocation_date);
      const weekStartDate = startOfWeek(allocationDate, { weekStartsOn: 1 }); // 1 = Monday
      const weekKey = format(weekStartDate, 'yyyy-MM-dd');
      
      const resourceId = allocation.resource_id;
      const allocationKey = getAllocationKey(resourceId, weekKey);
      const hours = allocation.hours;
      
      // Aggregate hours for the same resource + week
      if (initialAllocations[allocationKey]) {
        initialAllocations[allocationKey] += hours;
      } else {
        initialAllocations[allocationKey] = hours;
      }
      
      console.log(`DEBUG initializeAllocations - Processing allocation: ${allocation.allocation_date} -> week ${weekKey}, ${allocationKey} = ${initialAllocations[allocationKey]}h`);
    });
    
    console.log('DEBUG initializeAllocations - Final initialized allocations:', initialAllocations);
    console.log('DEBUG initializeAllocations - Total allocation keys created:', Object.keys(initialAllocations).length);
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
