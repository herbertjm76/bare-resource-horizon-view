import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Resource, ProjectAllocations, AddResourceInput } from './types/resourceTypes';
import { supabase } from '@/integrations/supabase/client';

export const useResourceManagement = (
  projectId: string, 
  resources: Resource[], 
  setResources: React.Dispatch<React.SetStateAction<Resource[]>>
) => {
  // Store project allocations by resource ID
  const [projectAllocations, setProjectAllocations] = useState<ProjectAllocations>({});
  
  // Initialize project allocations based on resources
  useEffect(() => {
    // Create initial allocation structure
    const initialAllocations: ProjectAllocations = {};
    
    resources.forEach(resource => {
      initialAllocations[resource.id] = resource.allocations || {};
    });
    
    setProjectAllocations(initialAllocations);
    console.debug('Initial project allocations set:', initialAllocations);
    
  }, [resources]);

  // Update allocation hours for a specific resource and week
  const handleAllocationChange = (resourceId: string, weekKey: string, hours: number) => {
    setProjectAllocations(prev => {
      // Create a new object to trigger React updates
      const updated = { ...prev };
      
      // Initialize resource allocations if they don't exist
      if (!updated[resourceId]) {
        updated[resourceId] = {};
      }
      
      // Update the hours for this specific week
      updated[resourceId] = {
        ...updated[resourceId],
        [weekKey]: hours
      };
      
      console.debug(`Updated allocation for resource ${resourceId}, week ${weekKey} to ${hours}h`);
      console.debug('Updated project allocations:', updated);
      
      return updated;
    });
  };

  // Delete a resource from the project
  const handleDeleteResource = async (resourceId: string) => {
    try {
      // Delete the resource from Supabase (use the correct collection name)
      const { error } = await supabase
        .from('project_resources')
        .delete()
        .eq('resource_id', resourceId)
        .eq('project_id', projectId);
      
      if (error) throw error;
      
      // Update local state
      setResources(prev => prev.filter(r => r.id !== resourceId));
      
      // Remove this resource's allocations from projectAllocations
      setProjectAllocations(prev => {
        const updated = { ...prev };
        delete updated[resourceId];
        return updated;
      });
      
    } catch (error) {
      console.error('Error deleting resource:', error);
      toast.error('Failed to delete resource');
    }
  };
  
  // Add a resource to the project - using the explicit AddResourceInput type
  const handleAddResource = (resourceData: AddResourceInput) => {
    // Convert from AddResourceDialog format to Resource format
    const resource: Resource = {
      id: resourceData.staffId,
      name: resourceData.name,
      role: resourceData.role || 'Team Member',
      isPending: resourceData.isPending
    };
    
    // Update resources list
    setResources(prev => [...prev, resource]);
    
    // Initialize empty allocations for this resource
    setProjectAllocations(prev => ({
      ...prev,
      [resource.id]: {}
    }));
    
    console.debug(`Added resource ${resource.id} (${resource.name}) to project ${projectId}`);
  };

  return {
    projectAllocations,
    handleAllocationChange,
    handleDeleteResource,
    handleAddResource
  };
};
