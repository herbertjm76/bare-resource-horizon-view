
import { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { Resource, AddResourceInput } from './types/resourceTypes';
import { supabase } from '@/integrations/supabase/client';

// Use a flat map instead of nested objects
type FlatAllocationMap = Record<string, number>;

// Helper to create composite keys
const createKey = (resourceId: string, weekKey: string) => `${resourceId}:${weekKey}`;

// Helper to parse composite keys
const parseKey = (compositeKey: string): { resourceId: string, weekKey: string } => {
  const [resourceId, weekKey] = compositeKey.split(':');
  return { resourceId, weekKey };
};

export const useResourceManagement = (
  projectId: string, 
  resources: Resource[], 
  setResources: React.Dispatch<React.SetStateAction<Resource[]>>
) => {
  // Use a flat structure to store allocations
  const [allAllocations, setAllAllocations] = useState<FlatAllocationMap>({});
  
  // Derived projectAllocations object (computed property)
  const projectAllocations = useMemo(() => {
    // Create a new object for returning to components
    const result: Record<string, Record<string, number>> = {};
    
    // Process flat allocations into the expected structure for component consumption
    Object.entries(allAllocations).forEach(([compositeKey, hours]) => {
      const { resourceId, weekKey } = parseKey(compositeKey);
      
      if (!result[resourceId]) {
        result[resourceId] = {};
      }
      
      result[resourceId][weekKey] = hours;
    });
    
    return result;
  }, [allAllocations]);
  
  // Update allocation hours for a resource and week
  const handleAllocationChange = (resourceId: string, weekKey: string, hours: number) => {
    const key = createKey(resourceId, weekKey);
    
    setAllAllocations(prev => ({
      ...prev,
      [key]: hours
    }));
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
      
      // Remove allocations for this resource
      setAllAllocations(prev => {
        const updated = { ...prev };
        
        // Find and remove all entries for this resource
        Object.keys(updated).forEach(key => {
          if (key.startsWith(`${resourceId}:`)) {
            delete updated[key];
          }
        });
        
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

  return {
    projectAllocations,
    handleAllocationChange,
    handleDeleteResource,
    handleAddResource
  };
};
