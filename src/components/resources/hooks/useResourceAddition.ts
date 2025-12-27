import { Resource } from './types/resourceTypes';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
    isPending?: boolean;
    isRole?: boolean;
  }) => {
    console.log('Adding resource to database:', resource);
    
    if (!companyId) {
      toast.error('Company information not available');
      return;
    }

    try {
      if (resource.isRole) {
        // Insert a placeholder allocation for role-based resource
        // This creates an entry that will be picked up by useFetchResources
        const { error } = await supabase
          .from('project_resource_allocations')
          .insert({
            project_id: projectId,
            resource_id: resource.staffId,
            resource_type: 'role',
            allocation_date: new Date().toISOString().split('T')[0],
            hours: 0,
            company_id: companyId
          });

        if (error) throw error;
      } else if (resource.isPending) {
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
        isPending: resource.isPending,
        isRole: resource.isRole
      };
      
      setResources([...resources, newResource]);
      console.log('Resource added successfully:', resource.name);
      
    } catch (error: any) {
      console.error('Error adding resource:', error);
      toast.error(`Failed to add ${resource.name}: ${error.message}`);
    }
  };

  return {
    handleAddResource
  };
};
