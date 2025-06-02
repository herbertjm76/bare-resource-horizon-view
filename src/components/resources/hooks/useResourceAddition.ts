
import { Resource } from './types/resourceTypes';

export const useResourceAddition = (
  resources: Resource[],
  setResources: (resources: Resource[]) => void
) => {
  // Add a new resource to the project
  const handleAddResource = (resource: { 
    staffId: string; 
    name: string; 
    role?: string; 
    isPending?: boolean 
  }) => {
    console.log('Adding resource to state:', resource);
    
    // Add the new resource to our local state immediately for UI feedback
    const newResource = {
      id: resource.staffId,
      name: resource.name,
      role: resource.role || 'Team Member',
      allocations: {},
      isPending: resource.isPending
    };
    
    setResources([...resources, newResource]);
  };

  return {
    handleAddResource
  };
};
