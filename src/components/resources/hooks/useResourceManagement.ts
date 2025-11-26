
import { useAllocationManagement } from './useAllocationManagement';
import { useResourceDeletion } from './useResourceDeletion';
import { useResourceAddition } from './useResourceAddition';
import { Resource } from './types/resourceTypes';

export const useResourceManagement = (
  projectId: string,
  companyId: string | undefined,
  resources: Resource[],
  setResources: (resources: Resource[]) => void
) => {
  // Allocation management
  const {
    projectAllocations,
    isLoadingAllocations,
    handleAllocationChange,
    removeResourceAllocations,
    getAllocationKey
  } = useAllocationManagement(projectId);

  // Resource deletion
  const {
    handleDeleteResource,
    checkResourceInOtherProjects
  } = useResourceDeletion(projectId, resources, setResources, removeResourceAllocations);

  // Resource addition
  const {
    handleAddResource
  } = useResourceAddition(projectId, companyId, resources, setResources);

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
