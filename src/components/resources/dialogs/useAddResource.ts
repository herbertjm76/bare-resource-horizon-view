
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import type { ResourceOption } from './useResourceOptions';
import { logger } from '@/utils/logger';

interface AddResourceProps {
  projectId: string;
  onAdd: (resource: { 
    staffId: string; 
    name: string; 
    role?: string; 
    isPending?: boolean 
  }) => void;
  onClose: () => void;
}

export const useAddResource = ({ projectId, onAdd, onClose }: AddResourceProps) => {
  const [selectedResource, setSelectedResource] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { company } = useCompany();

  const handleAdd = async () => {
    if (!selectedResource || !company?.id || !projectId) {
      toast.error('Please select a resource and try again');
      return;
    }
    
    setLoading(true);
    
    try {
      const resourceOptions = await getResourceOptions();
      const resource = resourceOptions.find(r => r.id === selectedResource);
      if (!resource) throw new Error('Resource not found');
      
      logger.debug('Adding resource:', { 
        resource,
        projectId,
        companyId: company.id,
        type: resource.type 
      });
      
      if (resource.type === 'pre-registered') {
        // Handle pre-registered resource (store in pending_resources)
        const { data, error } = await supabase
          .from('pending_resources')
          .insert({
            invite_id: resource.id,
            project_id: projectId,
            company_id: company.id, // Explicitly include company_id
            hours: 0 // Default hours
          })
          .select();
          
        if (error) {
          console.error('Error adding pending resource:', error);
          throw error;
        }
        
        logger.debug('Added pending resource:', data);
      } else {
        // Add active resource with company_id explicitly included
        const { data, error } = await supabase
          .from('project_resources')
          .insert({
            staff_id: resource.id,
            project_id: projectId,
            company_id: company.id, // This is critical for RLS policies
            hours: 0 // Default hours
          })
          .select();
          
        if (error) {
          console.error('Error adding active resource:', error);
          throw error;
        }
        
        logger.debug('Added active resource:', data);
      }
      
      // Call the onAdd callback with the resource details
      onAdd({ 
        staffId: resource.id, 
        name: resource.name,
        role: resource.role,
        isPending: resource.type === 'pre-registered'
      });
      
      toast.success(`${resource.name} added to project`);
      onClose();
    } catch (err: any) {
      console.error('Error adding resource:', err);
      toast.error('Failed to add resource: ' + (err.message || err.error_description || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get resource options
  const getResourceOptions = async (): Promise<ResourceOption[]> => {
    if (!company?.id) return [];

    const { data: activeMembers } = await supabase
      .from('profiles')
      .select('*')
      .eq('company_id', company.id);
    
    const { data: preregisteredMembers } = await supabase
      .from('invites')
      .select('*')
      .eq('company_id', company.id)
      .eq('invitation_type', 'pre_registered')
      .eq('status', 'pending');
    
    return [
      ...(activeMembers || []).map((member) => ({
        id: member.id,
        name: `${member.first_name || ''} ${member.last_name || ''}`.trim() || member.email,
        email: member.email,
        type: 'active' as const,
        role: member.job_title
      })),
      ...(preregisteredMembers || []).map((invite) => ({
        id: invite.id,
        name: `${invite.first_name || ''} ${invite.last_name || ''}`.trim() || invite.email,
        email: invite.email || '',
        type: 'pre-registered' as const,
        role: invite.job_title
      }))
    ];
  };

  return {
    selectedResource,
    loading,
    setSelectedResource,
    handleAdd
  };
};
