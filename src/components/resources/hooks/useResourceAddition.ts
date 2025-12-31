import { Resource } from './types/resourceTypes';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logger } from '@/utils/logger';

export const useResourceAddition = (
  projectId: string,
  companyId: string | undefined,
  resources: Resource[],
  setResources: (resources: Resource[]) => void
) => {
  // Add a new resource to the project
  const handleAddResource = async (resource: { 
    staffId: string; 
    name: string; 
    role?: string; 
    isPending?: boolean 
  }) => {
    logger.log('Adding resource to database:', resource);
    
    if (!companyId) {
      toast.error('Company information not available');
      return;
    }

    try {
      // Save to database based on whether it's pending or active
      if (resource.isPending) {
        // Insert into pending_resources for pre-registered members
        const { error } = await supabase
          .from('pending_resources')
          .insert({
            project_id: projectId,
            invite_id: resource.staffId,
            hours: 0,
            company_id: companyId
          });

        if (error) throw error;
      } else {
        // Insert into project_resources for active members
        const { error } = await supabase
          .from('project_resources')
          .insert({
            project_id: projectId,
            staff_id: resource.staffId,
            hours: 0,
            company_id: companyId
          });

        if (error) throw error;
      }

      // Add to local state for immediate UI feedback
      const newResource: Resource = {
        id: resource.staffId,
        name: resource.name,
        role: resource.role || 'Team Member',
        allocations: {},
        isPending: resource.isPending
      };
      
      setResources([...resources, newResource]);
      logger.log('Resource added successfully:', resource.name);
      
    } catch (error: any) {
      logger.error('Error adding resource:', error);
      toast.error(`Failed to add ${resource.name}: ${error.message}`);
    }
  };

  return {
    handleAddResource
  };
};
