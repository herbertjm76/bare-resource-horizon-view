
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { Resource, ProjectAllocations } from './types/resourceTypes';

export const useResourceManagement = (
  projectId: string,
  resources: Resource[],
  setResources: (resources: Resource[]) => void
) => {
  const [projectAllocations, setProjectAllocations] = useState<ProjectAllocations>({});
  const { company } = useCompany();

  // Handle resource allocation changes (for UI updates)
  const handleAllocationChange = (resourceId: string, weekKey: string, hours: number) => {
    setProjectAllocations(prev => ({
      ...prev,
      [resourceId]: {
        ...(prev[resourceId] || {}),
        [weekKey]: hours
      }
    }));
  };

  // Handle resource deletion
  const handleDeleteResource = async (resourceId: string) => {
    if (!projectId || !company?.id) return;
    
    try {
      console.log('Deleting resource:', resourceId);
      
      const resourceToDelete = resources.find(r => r.id === resourceId);
      
      if (resourceToDelete?.isPending) {
        // Delete pre-registered resource
        await supabase
          .from('pending_resources')
          .delete()
          .eq('project_id', projectId)
          .eq('invite_id', resourceId)
          .eq('company_id', company.id);
          
        // Also delete any allocations
        await supabase
          .from('project_resource_allocations')
          .delete()
          .eq('project_id', projectId)
          .eq('resource_id', resourceId)
          .eq('resource_type', 'pre_registered')
          .eq('company_id', company.id);
      } else {
        // Delete active resource
        await supabase
          .from('project_resources')
          .delete()
          .eq('project_id', projectId)
          .eq('staff_id', resourceId)
          .eq('company_id', company.id);
          
        // Also delete any allocations
        await supabase
          .from('project_resource_allocations')
          .delete()
          .eq('project_id', projectId)
          .eq('resource_id', resourceId)
          .eq('resource_type', 'active')
          .eq('company_id', company.id);
      }
      
      // Update UI state
      setResources(resources.filter(r => r.id !== resourceId));
      setProjectAllocations(prev => {
        const updated = { ...prev };
        delete updated[resourceId];
        return updated;
      });
      
    } catch (error) {
      console.error('Error deleting resource:', error);
      toast.error('Failed to remove resource from project');
    }
  };

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
    projectAllocations,
    handleAllocationChange,
    handleDeleteResource,
    handleAddResource
  };
};
