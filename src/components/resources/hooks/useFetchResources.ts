
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { Resource } from './types/resourceTypes';

export const useFetchResources = (projectId: string) => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { company } = useCompany();

  // Fetch resources for this project
  const fetchResources = useCallback(async () => {
    if (!projectId || !company?.id) {
      console.log('Missing projectId or company.id');
      setIsLoading(false);
      return [];
    }
    
    setIsLoading(true);
    try {
      console.log('Fetching resources for project:', projectId, 'company:', company.id);
      
      // Fetch active members assigned to this project with avatar URLs
      const { data: activeMembers, error: activeError } = await supabase
        .from('project_resources')
        .select(`
          id, 
          hours,
          staff_id,
          staff:profiles(id, first_name, last_name, job_title, avatar_url)
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
        avatar_url: member.staff?.avatar_url,
        first_name: member.staff?.first_name,
        last_name: member.staff?.last_name,
      }));
      
      const pendingResources: Resource[] = (preRegisteredMembers || []).map(member => ({
        id: member.invite_id,
        name: `${member.invite?.first_name || ''} ${member.invite?.last_name || ''}`.trim() || 'Unnamed',
        role: member.invite?.job_title || 'Team Member',
        isPending: true,
        first_name: member.invite?.first_name,
        last_name: member.invite?.last_name,
      }));
      
      // Combine resources
      const combinedResources = [...activeResources, ...pendingResources];
      
      // Update state
      setResources(combinedResources);
      setIsLoading(false);
      
      return combinedResources;
      
    } catch (error) {
      console.error('Error fetching project resources:', error);
      toast.error('Failed to load project resources');
      setIsLoading(false);
      return [];
    }
  }, [projectId, company?.id]);

  // Fetch resources on initial load
  useEffect(() => {
    if (projectId && company?.id) {
      fetchResources();
    }
  }, [projectId, company?.id, fetchResources]);

  return {
    resources,
    isLoading,
    setResources,
    refreshResources: fetchResources
  };
};
