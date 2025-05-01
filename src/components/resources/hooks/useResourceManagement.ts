
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Resource, AllocationsByWeek, AddResourceInput } from './types/resourceTypes';
import { supabase } from '@/integrations/supabase/client';

export const useResourceManagement = (
  projectId: string, 
  resources: Resource[], 
  setResources: React.Dispatch<React.SetStateAction<Resource[]>>
) => {
  // Use a simple Record type to store allocations
  const [projectAllocations, setProjectAllocations] = useState<Record<string, AllocationsByWeek>>({});
  
  // Initialize allocations when resources change
  useEffect(() => {
    const initialAllocations: Record<string, AllocationsByWeek> = {};
    
    resources.forEach(resource => {
      // Make sure we don't access potentially undefined properties
      initialAllocations[resource.id] = {};
    });
    
    setProjectAllocations(initialAllocations);
    
  }, [resources]);

  // Update allocation hours for a resource and week
  const handleAllocationChange = (resourceId: string, weekKey: string, hours: number) => {
    setProjectAllocations(prev => {
      // Create a new object to avoid mutation
      const updated: Record<string, AllocationsByWeek> = { ...prev };
      
      // Initialize resource allocations if they don't exist
      if (!updated[resourceId]) {
        updated[resourceId] = {};
      }
      
      // Update the specific week
      updated[resourceId] = {
        ...updated[resourceId],
        [weekKey]: hours
      };
      
      return updated;
    });
  };

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
      
      // Remove allocations
      setProjectAllocations(prev => {
        const updated: Record<string, AllocationsByWeek> = { ...prev };
        delete updated[resourceId];
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
    
    // Initialize empty allocations
    setProjectAllocations(prev => {
      const updated: Record<string, AllocationsByWeek> = { ...prev };
      updated[resource.id] = {};
      return updated;
    });
  };

  return {
    projectAllocations,
    handleAllocationChange,
    handleDeleteResource,
    handleAddResource
  };
};
