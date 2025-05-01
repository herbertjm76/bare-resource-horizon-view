
import { useState } from 'react';
import { useFetchResources } from './useFetchResources';
import { useResourceManagement } from './useResourceManagement';
import { Resource } from './types/resourceTypes';

export type { Resource } from './types/resourceTypes';

export const useProjectResources = (projectId: string) => {
  const [showAddResource, setShowAddResource] = useState(false);
  
  // Get resources data
  const { resources, isLoading, setResources, refreshResources } = useFetchResources(projectId);
  
  // Get resource management functions
  const { 
    projectAllocations, 
    handleAllocationChange, 
    handleDeleteResource, 
    handleAddResource,
    getAllocationKey
  } = useResourceManagement(projectId, resources, setResources);

  return {
    resources,
    projectAllocations,
    showAddResource,
    isLoading,
    setShowAddResource,
    handleAllocationChange,
    handleDeleteResource,
    handleAddResource,
    refreshResources,
    getAllocationKey
  };
};
