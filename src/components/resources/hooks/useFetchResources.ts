
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
          profiles!project_resources_staff_id_fkey(id, first_name, last_name, job_title, avatar_url)
        `)
        .eq('project_id', projectId)
        .eq('company_id', company.id);
      
      if (activeError) {
        console.error('Error fetching active members:', activeError);
        throw activeError;
      }
      
      console.log('DEBUG useFetchResources - Active members from project_resources table:', activeMembers);
      console.log('DEBUG useFetchResources - Active members count:', activeMembers?.length || 0);
      
      // Fetch pre-registered members assigned to this project
      const { data: preRegisteredMembers, error: pendingError } = await supabase
        .from('pending_resources')
        .select(`
          id,
          hours,
          invite_id,
          invites!pending_resources_invite_id_fkey(id, first_name, last_name, job_title)
        `)
        .eq('project_id', projectId)
        .eq('company_id', company.id);
        
      if (pendingError) {
        console.error('Error fetching pending members:', pendingError);
        throw pendingError;
      }
      
      console.log('DEBUG useFetchResources - Pre-registered members from pending_resources table:', preRegisteredMembers);
      console.log('DEBUG useFetchResources - Pre-registered members count:', preRegisteredMembers?.length || 0);
      
      // Fetch role-based allocations for this project
      const { data: roleAllocations, error: roleError } = await supabase
        .from('project_resource_allocations')
        .select('resource_id')
        .eq('project_id', projectId)
        .eq('company_id', company.id)
        .eq('resource_type', 'role');

      if (roleError) {
        console.error('Error fetching role allocations:', roleError);
      }

      // Get unique role IDs
      const roleIds = [...new Set(roleAllocations?.map(a => a.resource_id) || [])];
      console.log('DEBUG useFetchResources - Role IDs found:', roleIds);

      // Fetch role details from office_roles
      let roleResources: Resource[] = [];
      if (roleIds.length > 0) {
        const { data: roles, error: rolesError } = await supabase
          .from('office_roles')
          .select('id, name')
          .in('id', roleIds);

        if (rolesError) {
          console.error('Error fetching role details:', rolesError);
        } else {
          roleResources = (roles || []).map(role => ({
            id: role.id,
            name: role.name,
            role: role.name,
            isPending: false,
            isRole: true
          }));
        }
      }

      console.log('DEBUG useFetchResources - Role resources:', roleResources);
      
      // Format the results to match our Resource interface
      const activeResources: Resource[] = (activeMembers || []).map(member => {
        const profile = member.profiles as any;
        return {
          id: member.staff_id,
          name: `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || 'Unnamed',
          role: profile?.job_title || 'Team Member',
          isPending: false,
          isRole: false,
          avatar_url: profile?.avatar_url,
          first_name: profile?.first_name,
          last_name: profile?.last_name,
        };
      });
      
      const pendingResources: Resource[] = (preRegisteredMembers || []).map(member => {
        const invite = member.invites as any;
        return {
          id: member.invite_id,
          name: `${invite?.first_name || ''} ${invite?.last_name || ''}`.trim() || 'Unnamed',
          role: invite?.job_title || 'Team Member',
          isPending: true,
          isRole: false,
          first_name: invite?.first_name,
          last_name: invite?.last_name,
        };
      });
      
      // Check for allocations that exist without corresponding resource entries (excluding roles)
      const { data: orphanedAllocations, error: allocError } = await supabase
        .from('project_resource_allocations')
        .select(`
          resource_id,
          resource_type,
          hours
        `)
        .eq('project_id', projectId)
        .eq('company_id', company.id)
        .neq('resource_type', 'role');

      console.log('DEBUG useFetchResources - Orphaned allocations:', orphanedAllocations);

      // Get unique resource IDs from allocations that aren't in our resource lists
      const existingResourceIds = new Set([
        ...activeResources.map(r => r.id),
        ...pendingResources.map(r => r.id),
        ...roleResources.map(r => r.id)
      ]);

      const orphanedResourceIds = new Set();
      orphanedAllocations?.forEach(allocation => {
        if (!existingResourceIds.has(allocation.resource_id)) {
          orphanedResourceIds.add(allocation.resource_id);
        }
      });

      console.log('DEBUG useFetchResources - Orphaned resource IDs:', Array.from(orphanedResourceIds));

      // Fetch profile information for orphaned resources
      const orphanedResources: Resource[] = [];
      if (orphanedResourceIds.size > 0) {
        // Check if they are active users
        const { data: orphanedProfiles } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, job_title, avatar_url')
          .in('id', Array.from(orphanedResourceIds) as string[]);

        orphanedProfiles?.forEach(profile => {
          orphanedResources.push({
            id: profile.id,
            name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Unnamed',
            role: profile.job_title || 'Team Member',
            isPending: false,
            isRole: false,
            avatar_url: profile.avatar_url,
            first_name: profile.first_name,
            last_name: profile.last_name,
          });
        });

        // Check if they are pending invites
        const remainingIds = Array.from(orphanedResourceIds).filter(id => 
          !orphanedProfiles?.some(p => p.id === id)
        );

        if (remainingIds.length > 0) {
          const { data: orphanedInvites } = await supabase
            .from('invites')
            .select('id, first_name, last_name, job_title')
            .in('id', remainingIds as string[]);

          orphanedInvites?.forEach(invite => {
            orphanedResources.push({
              id: invite.id,
              name: `${invite.first_name || ''} ${invite.last_name || ''}`.trim() || 'Unnamed',
              role: invite.job_title || 'Team Member',
              isPending: true,
              isRole: false,
              first_name: invite.first_name,
              last_name: invite.last_name,
            });
          });
        }
      }

      console.log('DEBUG useFetchResources - Orphaned resources found:', orphanedResources);

      // Combine all resources
      const combinedResources = [...activeResources, ...pendingResources, ...roleResources, ...orphanedResources];
      
      console.log('DEBUG useFetchResources - Final combined resources for project:', combinedResources);
      console.log('DEBUG useFetchResources - Total resources count:', combinedResources.length);
      
      if (combinedResources.length === 0) {
        console.log('DEBUG useFetchResources - No resources found for this project. User needs to add resources first.');
      }
      
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
