
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { Resource } from './types/resourceTypes';
import { logger } from '@/utils/logger';
import { useDemoAuth } from '@/hooks/useDemoAuth';
import { DEMO_TEAM_MEMBERS, generateDemoAllocations } from '@/data/demoData';

export const useFetchResources = (projectId: string) => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { company } = useCompany();
  const { isDemoMode } = useDemoAuth();

  // Fetch resources for this project
  const fetchResources = useCallback(async () => {
    if (!projectId) {
      setIsLoading(false);
      return [];
    }

    // Demo mode: derive resources from demo allocations (no DB reads)
    if (isDemoMode) {
      setIsLoading(true);
      try {
        const demoAllocations = generateDemoAllocations().filter((a) => a.project_id === projectId);
        const resourceIds = Array.from(new Set(demoAllocations.map((a) => a.resource_id)));

        const demoResources: Resource[] = resourceIds
          .map((id) => DEMO_TEAM_MEMBERS.find((m) => m.id === id))
          .filter(Boolean)
          .map((m) => ({
            id: m!.id,
            name: `${m!.first_name || ''} ${m!.last_name || ''}`.trim() || 'Unnamed',
            role: m!.job_title || 'Team Member',
            isPending: false,
            avatar_url: (m as any).avatar_url,
            first_name: m!.first_name,
            last_name: m!.last_name,
            department: m!.department,
            practice_area: (m as any).practice_area,
            location: m!.location,
          }));

        setResources(demoResources);
        setIsLoading(false);
        return demoResources;
      } catch (error) {
        logger.error('Demo: Error building project resources:', error);
        setResources([]);
        setIsLoading(false);
        return [];
      }
    }

    if (!company?.id) {
      logger.debug('Missing projectId or company.id');
      setIsLoading(false);
      return [];
    }

    setIsLoading(true);
    try {
      logger.debug('Fetching resources for project:', projectId, 'company:', company.id);

      // Fetch active members assigned to this project with avatar URLs
      const { data: activeMembers, error: activeError } = await supabase
        .from('project_resources')
        .select(`
          id, 
          hours,
          staff_id,
          profiles!project_resources_staff_id_fkey(id, first_name, last_name, job_title, avatar_url, department, practice_area, location)
        `)
        .eq('project_id', projectId)
        .eq('company_id', company.id);

      if (activeError) {
        logger.error('Error fetching active members:', activeError);
        throw activeError;
      }

      // Fetch pre-registered members assigned to this project
      const { data: preRegisteredMembers, error: pendingError } = await supabase
        .from('pending_resources')
        .select(`
          id,
          hours,
          invite_id,
          invites!pending_resources_invite_id_fkey(id, first_name, last_name, job_title, department, practice_area, location)
        `)
        .eq('project_id', projectId)
        .eq('company_id', company.id);

      if (pendingError) {
        logger.error('Error fetching pending members:', pendingError);
        throw pendingError;
      }

      // Format the results to match our Resource interface
      const activeResources: Resource[] = (activeMembers || []).map((member) => {
        const profile = member.profiles as any;
        return {
          id: member.staff_id,
          name: `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || 'Unnamed',
          role: profile?.job_title || 'Team Member',
          isPending: false,
          avatar_url: profile?.avatar_url,
          first_name: profile?.first_name,
          last_name: profile?.last_name,
          department: profile?.department,
          practice_area: profile?.practice_area,
          location: profile?.location,
        };
      });

      const pendingResources: Resource[] = (preRegisteredMembers || []).map((member) => {
        const invite = member.invites as any;
        return {
          id: member.invite_id,
          name: `${invite?.first_name || ''} ${invite?.last_name || ''}`.trim() || 'Unnamed',
          role: invite?.job_title || 'Team Member',
          isPending: true,
          first_name: invite?.first_name,
          last_name: invite?.last_name,
          department: invite?.department,
          practice_area: invite?.practice_area,
          location: invite?.location,
        };
      });

      // Check for allocations that exist without corresponding resource entries
      const { data: orphanedAllocations } = await supabase
        .from('project_resource_allocations')
        .select(`
          resource_id,
          resource_type,
          hours
        `)
        .eq('project_id', projectId)
        .eq('company_id', company.id);

      // Get unique resource IDs from allocations that aren't in our resource lists
      const existingResourceIds = new Set([...activeResources.map((r) => r.id), ...pendingResources.map((r) => r.id)]);

      const orphanedResourceIds = new Set<string>();
      orphanedAllocations?.forEach((allocation: any) => {
        if (!existingResourceIds.has(allocation.resource_id)) {
          orphanedResourceIds.add(allocation.resource_id);
        }
      });

      // Fetch profile information for orphaned resources
      const orphanedResources: Resource[] = [];
      if (orphanedResourceIds.size > 0) {
        const orphanedIds = Array.from(orphanedResourceIds);

        // Check if they are active users
        const { data: orphanedProfiles } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, job_title, avatar_url, department, practice_area, location')
          .in('id', orphanedIds);

        orphanedProfiles?.forEach((profile) => {
          orphanedResources.push({
            id: profile.id,
            name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Unnamed',
            role: profile.job_title || 'Team Member',
            isPending: false,
            avatar_url: profile.avatar_url,
            first_name: profile.first_name,
            last_name: profile.last_name,
            department: profile.department,
            practice_area: profile.practice_area,
            location: profile.location,
          });
        });

        // Check if they are pending invites
        const remainingIds = orphanedIds.filter((id) => !orphanedProfiles?.some((p) => p.id === id));

        if (remainingIds.length > 0) {
          const { data: orphanedInvites } = await supabase
            .from('invites')
            .select('id, first_name, last_name, job_title, department, practice_area, location')
            .in('id', remainingIds);

          orphanedInvites?.forEach((invite) => {
            orphanedResources.push({
              id: invite.id,
              name: `${invite.first_name || ''} ${invite.last_name || ''}`.trim() || 'Unnamed',
              role: invite.job_title || 'Team Member',
              isPending: true,
              first_name: invite.first_name,
              last_name: invite.last_name,
              department: invite.department,
              practice_area: invite.practice_area,
              location: invite.location,
            });
          });
        }
      }

      const combinedResources = [...activeResources, ...pendingResources, ...orphanedResources];

      setResources(combinedResources);
      setIsLoading(false);

      return combinedResources;
    } catch (error) {
      logger.error('Error fetching project resources:', error);
      toast.error('Failed to load project resources');
      setIsLoading(false);
      return [];
    }
  }, [projectId, company?.id, isDemoMode]);

  useEffect(() => {
    if (projectId && (isDemoMode || company?.id)) {
      fetchResources();
    }
  }, [projectId, company?.id, isDemoMode, fetchResources]);

  return {
    resources,
    isLoading,
    setResources,
    refreshResources: fetchResources,
  };
};

