
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';

export interface Resource {
  id: string;
  name: string;
  role: string;
  allocations?: Record<string, number>;
  isPending?: boolean;
}

export const useProjectResources = (projectId: string) => {
  const [showAddResource, setShowAddResource] = useState(false);
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { company } = useCompany();

  // Track all allocations by resource and week for UI updates
  const [projectAllocations, setProjectAllocations] = useState<Record<string, Record<string, number>>>({});

  // Fetch resources for this project
  const fetchResources = useCallback(async () => {
    if (!projectId || !company?.id) return;
    
    setIsLoading(true);
    try {
      console.log('Fetching resources for project:', projectId);
      
      // Fetch active members assigned to this project
      const { data: activeMembers, error: activeError } = await supabase
        .from('project_resources')
        .select(`
          id, 
          hours,
          staff_id,
          staff:profiles(id, first_name, last_name, job_title)
        `)
        .eq('project_id', projectId)
        .eq('company_id', company.id);
      
      if (activeError) {
        console.error('Error fetching active members:', activeError);
        throw activeError;
      }
      
      console.log('Active members:', activeMembers);
      
      // Fetch pre-registered members assigned to this project
      const { data: preRegisteredMembers, error: pendingError } = await supabase
        .from('pending_resources')
        .select(`
          id,
          hours,
          invite_id,
          invite:invites(id, first_name, last_name, job_title)
        `)
        .eq('project_id', projectId)
        .eq('company_id', company.id);
        
      if (pendingError) {
        console.error('Error fetching pending members:', pendingError);
        throw pendingError;
      }
      
      console.log('Pre-registered members:', preRegisteredMembers);
      
      // Format the results to match our Resource interface
      const activeResources: Resource[] = (activeMembers || []).map(member => ({
        id: member.staff_id,
        name: `${member.staff?.first_name || ''} ${member.staff?.last_name || ''}`.trim() || 'Unnamed',
        role: member.staff?.job_title || 'Team Member',
        isPending: false,
      }));
      
      const pendingResources: Resource[] = (preRegisteredMembers || []).map(member => ({
        id: member.invite_id,
        name: `${member.invite?.first_name || ''} ${member.invite?.last_name || ''}`.trim() || 'Unnamed',
        role: member.invite?.job_title || 'Team Member',
        isPending: true,
      }));
      
      // Combine and set resources
      setResources([...activeResources, ...pendingResources]);
      
    } catch (error) {
      console.error('Error fetching project resources:', error);
      toast.error('Failed to load project resources');
    } finally {
      setIsLoading(false);
    }
  }, [projectId, company?.id]);

  // Fetch resources on initial load
  useEffect(() => {
    if (projectId && company?.id) {
      fetchResources();
    }
  }, [projectId, company?.id, fetchResources]);

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
      setResources(prev => prev.filter(r => r.id !== resourceId));
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
  const handleAddResource = async (resource: { staffId: string; name: string; role?: string; isPending?: boolean }) => {
    console.log('Adding resource to state:', resource);
    
    // Add the new resource to our local state immediately for UI feedback
    const newResource = {
      id: resource.staffId,
      name: resource.name,
      role: resource.role || 'Team Member',
      allocations: {},
      isPending: resource.isPending
    };
    
    setResources(prev => [...prev, newResource]);
    setShowAddResource(false);
  };

  return {
    resources,
    projectAllocations,
    showAddResource,
    isLoading,
    setShowAddResource,
    handleAllocationChange,
    handleDeleteResource,
    handleAddResource,
    refreshResources: fetchResources
  };
};
