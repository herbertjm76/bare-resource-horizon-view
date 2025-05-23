
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { Resource, ProjectAllocations } from './types/resourceTypes';

// Create a utility function to generate allocation keys
const getAllocationKey = (resourceId: string, weekKey: string): string => {
  return `${resourceId}:${weekKey}`;
};

// Utility to parse the composite key
const parseAllocationKey = (compositeKey: string): { resourceId: string, weekKey: string } => {
  const [resourceId, weekKey] = compositeKey.split(':');
  return { resourceId, weekKey };
};

export const useResourceManagement = (
  projectId: string,
  resources: Resource[],
  setResources: (resources: Resource[]) => void
) => {
  const [projectAllocations, setProjectAllocations] = useState<ProjectAllocations>({});
  const [isLoadingAllocations, setIsLoadingAllocations] = useState<boolean>(true);
  const { company } = useCompany();

  // Initialize project allocations from database
  const initializeAllocations = async () => {
    if (!projectId || !company?.id) return;
    
    setIsLoadingAllocations(true);
    
    try {
      console.log('Initializing allocations for project:', projectId);
      
      // Fetch all resource allocations for this project from database
      const { data, error } = await supabase
        .from('project_resource_allocations')
        .select('resource_id, week_start_date, hours')
        .eq('project_id', projectId)
        .eq('company_id', company.id);
        
      if (error) {
        console.error('Error fetching resource allocations:', error);
        toast.error('Failed to load resource allocations');
        return;
      }
      
      console.log('Fetched allocations:', data?.length || 0);
      
      // Transform the data into our allocation structure
      const initialAllocations: ProjectAllocations = {};
      
      data?.forEach(allocation => {
        const weekKey = allocation.week_start_date;
        const resourceId = allocation.resource_id;
        const allocationKey = getAllocationKey(resourceId, weekKey);
        initialAllocations[allocationKey] = allocation.hours;
      });
      
      console.log('Initialized allocations:', initialAllocations);
      setProjectAllocations(initialAllocations);
      
    } catch (err) {
      console.error('Error in initializeAllocations:', err);
      toast.error('Failed to load resource allocations');
    } finally {
      setIsLoadingAllocations(false);
    }
  };

  // Load resource allocations when the component mounts or resources change
  useEffect(() => {
    if (projectId && company?.id) {
      initializeAllocations();
    }
  }, [projectId, company?.id]);

  // Handle resource allocation changes (for UI updates)
  const handleAllocationChange = (resourceId: string, weekKey: string, hours: number) => {
    const allocationKey = getAllocationKey(resourceId, weekKey);
    
    setProjectAllocations(prev => ({
      ...prev,
      [allocationKey]: hours
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
      
      // Remove all allocations for this resource
      setProjectAllocations(prev => {
        const updated = { ...prev };
        // Loop through and remove any keys that start with this resourceId
        Object.keys(updated).forEach(key => {
          if (key.startsWith(`${resourceId}:`)) {
            delete updated[key];
          }
        });
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
    handleAddResource,
    getAllocationKey,
    isLoadingAllocations
  };
};
