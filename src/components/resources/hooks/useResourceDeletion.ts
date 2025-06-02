
import { useCompany } from '@/context/CompanyContext';
import { Resource } from './types/resourceTypes';
import { deleteResource } from './services/resourceDeletionService';
import { checkResourceInOtherProjects } from './services/allocationService';

export const useResourceDeletion = (
  projectId: string,
  resources: Resource[],
  setResources: (resources: Resource[]) => void,
  removeResourceAllocations: (resourceId: string) => void
) => {
  const { company } = useCompany();

  // Check if resource has allocations in other projects
  const checkResourceInOtherProjectsHandler = async (resourceId: string, resourceType: 'active' | 'pre_registered') => {
    if (!company?.id) return { hasOtherAllocations: false, projectCount: 0 };
    
    return checkResourceInOtherProjects(resourceId, resourceType, projectId, company.id);
  };

  // Handle resource deletion with global option
  const handleDeleteResource = async (resourceId: string, globalDelete: boolean = false) => {
    if (!projectId || !company?.id) return;
    
    const success = await deleteResource(resourceId, globalDelete, projectId, company.id, resources);
    
    if (success) {
      // Update UI state
      setResources(resources.filter(r => r.id !== resourceId));
      
      // Remove all allocations for this resource from local state
      removeResourceAllocations(resourceId);
    }
  };

  return {
    handleDeleteResource,
    checkResourceInOtherProjects: checkResourceInOtherProjectsHandler
  };
};
