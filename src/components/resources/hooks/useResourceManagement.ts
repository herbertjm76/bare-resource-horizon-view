
import { useState } from 'react';
import { toast } from 'sonner';
import { Resource, AddResourceInput } from './types/resourceTypes';
import { supabase } from '@/integrations/supabase/client';
import { useResourceAllocationsDB } from '@/hooks/resource-allocations';

export const useResourceManagement = (
  projectId: string, 
  resources: Resource[], 
  setResources: React.Dispatch<React.SetStateAction<Resource[]>>
) => {
  // We'll use a simpler structure that leverages the existing hooks
  // and maintains compatibility with the consuming components
  const [projectAllocations, setProjectAllocations] = useState<Record<string, Record<string, number>>>({});
  
  // Delete a resource from the project
  const handleDeleteResource = async (resourceId: string) => {
    try {
      // Delete from database
      const { error } = await supabase
        .from('project_resources')
        .delete()
        .eq('resource_id', resourceId)
        .eq('project_id', projectId);
      
      if (error) throw error;
      
      // Update local state
      setResources(prev => prev.filter(r => r.id !== resourceId));
      
      // Remove allocations for this resource
      setProjectAllocations(prev => {
        const updated = { ...prev };
        if (updated[resourceId]) {
          delete updated[resourceId];
        }
        return updated;
      });
      
    } catch (error) {
      console.error('Error deleting resource:', error);
      toast.error('Failed to delete resource');
    }
  };
  
  // Add a resource to the project
  const handleAddResource = (resourceData: AddResourceInput) => {
    // Convert from AddResourceInput to Resource format
    const resource: Resource = {
      id: resourceData.staffId,
      name: resourceData.name,
      role: resourceData.role || 'Team Member',
      isPending: resourceData.isPending
    };
    
    // Update resources list
    setResources(prev => [...prev, resource]);
  };
  
  // Update allocation hours for a resource and week
  // This function now just updates our local state for UI consistency
  // The actual DB operations are handled by the ResourceRow component
  const handleAllocationChange = (resourceId: string, weekKey: string, hours: number) => {
    setProjectAllocations(prev => {
      const resourceAllocations = prev[resourceId] || {};
      return {
        ...prev,
        [resourceId]: {
          ...resourceAllocations,
          [weekKey]: hours
        }
      };
    });
  };

  return {
    projectAllocations,
    handleAllocationChange,
    handleDeleteResource,
    handleAddResource
  };
};
