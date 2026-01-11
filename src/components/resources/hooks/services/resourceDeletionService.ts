
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Resource } from '../types/resourceTypes';
import { logger } from '@/utils/logger';
import { deleteAllResourceAllocationsForProject } from '@/hooks/allocations/api';

export const deleteResource = async (
  resourceId: string,
  globalDelete: boolean,
  projectId: string,
  companyId: string,
  resources: Resource[]
): Promise<boolean> => {
  try {
    logger.debug('Deleting resource:', resourceId, 'globalDelete:', globalDelete);
    
    const resourceToDelete = resources.find(r => r.id === resourceId);
    const resourceType = resourceToDelete?.isPending ? 'pre_registered' : 'active';
    
    if (globalDelete) {
      // Global deletion - remove from all projects and clean up all allocations
      logger.debug('Performing global deletion for resource:', resourceId);
      
      if (resourceToDelete?.isPending) {
        // Delete all pre-registered resource entries
        await supabase
          .from('pending_resources')
          .delete()
          .eq('invite_id', resourceId)
          .eq('company_id', companyId);
      } else {
        // Delete all active resource entries
        await supabase
          .from('project_resources')
          .delete()
          .eq('staff_id', resourceId)
          .eq('company_id', companyId);
      }
      
      // RULEBOOK: Delete ALL allocations for this resource across all projects
      // This is a global delete, so we delete directly (no project scope)
      await supabase
        .from('project_resource_allocations')
        .delete()
        .eq('resource_id', resourceId)
        .eq('company_id', companyId);
        
      toast.success(`${resourceToDelete?.name} removed from all projects and allocations cleared`);
    } else {
      // Project-specific deletion - only remove from current project
      if (resourceToDelete?.isPending) {
        await supabase
          .from('pending_resources')
          .delete()
          .eq('project_id', projectId)
          .eq('invite_id', resourceId)
          .eq('company_id', companyId);
      } else {
        await supabase
          .from('project_resources')
          .delete()
          .eq('project_id', projectId)
          .eq('staff_id', resourceId)
          .eq('company_id', companyId);
      }
      
      // RULEBOOK: Use canonical API for project-specific allocation deletion
      await deleteAllResourceAllocationsForProject(
        projectId,
        resourceId,
        resourceType,
        companyId
      );
        
      toast.success(`${resourceToDelete?.name} removed from this project`);
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting resource:', error);
    toast.error('Failed to remove resource from project');
    return false;
  }
};
