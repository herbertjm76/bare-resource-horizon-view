
import { useFetchResources } from './useFetchResources';
import { useResourceManagement } from './useResourceManagement';
import { Resource } from './types/resourceTypes';

export const useProjectResourcesData = (
  projectId: string,
  companyId: string | undefined,
  resources: Resource[],
  setResources: (resources: Resource[]) => void
) => {
  // Get resource management functions
  const { 
    projectAllocations, 
    handleAllocationChange, 
    handleDeleteResource, 
    handleAddResource,
    checkResourceInOtherProjects,
    getAllocationKey,
    isLoadingAllocations
  } = useResourceManagement(projectId, companyId, resources, setResources);

  return {
    projectAllocations,
    handleAllocationChange,
    handleDeleteResource,
    handleAddResource,
    checkResourceInOtherProjects,
    getAllocationKey,
    isLoadingAllocations
  };
};
