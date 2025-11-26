
import { useFetchResources } from './useFetchResources';
import { useProjectResourcesState } from './useProjectResourcesState';
import { useProjectResourcesData } from './useProjectResourcesData';
import { useCompany } from '@/context/CompanyContext';

export type { Resource } from './types/resourceTypes';

export const useProjectResources = (projectId: string) => {
  const { company } = useCompany();
  
  // Get UI state
  const { showAddResource, setShowAddResource } = useProjectResourcesState();
  
  // Get resources data
  const { resources, isLoading, setResources, refreshResources } = useFetchResources(projectId);
  
  // Get resource management functions
  const { 
    projectAllocations, 
    handleAllocationChange, 
    handleDeleteResource, 
    handleAddResource,
    checkResourceInOtherProjects,
    getAllocationKey,
    isLoadingAllocations
  } = useProjectResourcesData(projectId, company?.id, resources, setResources);

  return {
    resources,
    projectAllocations,
    showAddResource,
    isLoading,
    isLoadingAllocations,
    setShowAddResource,
    handleAllocationChange,
    handleDeleteResource,
    handleAddResource,
    checkResourceInOtherProjects,
    refreshResources,
    getAllocationKey
  };
};
