import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { Resource } from './types/resourceTypes';
import { logger } from '@/utils/logger';
import { useDemoAuth } from '@/hooks/useDemoAuth';
import { DEMO_TEAM_MEMBERS, generateDemoAllocations } from '@/data/demoData';

const demoStorageKey = (projectId: string) => `demo_project_resources:${projectId}`;

const uniqueById = <T extends { id: string }>(items: T[]): T[] => {
  const map = new Map<string, T>();
  for (const item of items) map.set(item.id, item);
  return Array.from(map.values());
};

export const useFetchResources = (projectId: string) => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { company } = useCompany();
  const { isDemoMode } = useDemoAuth();

  // Persist demo resources so "add resource" survives refresh/navigation.
  useEffect(() => {
    if (!isDemoMode || !projectId) return;
    try {
      localStorage.setItem(demoStorageKey(projectId), JSON.stringify(resources));
    } catch (e) {
      // non-fatal
      logger.debug('Demo: failed to persist project resources', e);
    }
  }, [isDemoMode, projectId, resources]);

  // Fetch resources for this project
  const fetchResources = useCallback(async () => {
    if (!projectId) {
      setIsLoading(false);
      return [];
    }

    // Demo mode: merge persisted + derived-from-demo-allocations (never overwrite additions)
    if (isDemoMode) {
      setIsLoading(true);
      try {
        const demoAllocations = generateDemoAllocations().filter((a) => a.project_id === projectId);
        const resourceIds = Array.from(new Set(demoAllocations.map((a) => a.resource_id)));

        const derivedResources: Resource[] = resourceIds
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

        let persisted: Resource[] = [];
        try {
          const raw = localStorage.getItem(demoStorageKey(projectId));
          if (raw) persisted = JSON.parse(raw);
        } catch {
          persisted = [];
        }

        const merged = uniqueById<Resource>([...persisted, ...derivedResources, ...resources]);
        setResources(merged);
        setIsLoading(false);
        return merged;
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

      // Fetch active members assigned to this project (no join - avoids RLS issues)
      const { data: activeMembers, error: activeError } = await supabase
        .from('project_resources')
        .select('id, hours, staff_id')
        .eq('project_id', projectId)
        .eq('company_id', company.id);

      if (activeError) {
        logger.error('Error fetching active members:', activeError);
        throw activeError;
      }

      // Fetch pre-registered members assigned to this project (no join - avoids RLS issues)
      const { data: preRegisteredMembers, error: pendingError } = await supabase
        .from('pending_resources')
        .select('id, hours, invite_id')
        .eq('project_id', projectId)
        .eq('company_id', company.id);

      if (pendingError) {
        logger.error('Error fetching pending members:', pendingError);
        throw pendingError;
      }

      // Fetch related profile + invite details in a best-effort way.
      // These can fail for non-admin users due to RLS; we degrade gracefully instead of failing the whole grid.
      const staffIds = Array.from(new Set((activeMembers || []).map((m) => m.staff_id).filter(Boolean)));
      const inviteIds = Array.from(new Set((preRegisteredMembers || []).map((m) => m.invite_id).filter(Boolean)));

      const profileById = new Map<string, any>();
      if (staffIds.length > 0) {
        try {
          // SECURITY DEFINER function that returns company-scoped profiles (email masked for non-admins).
          const { data: profilesData, error: profilesError } = await supabase.rpc('get_profiles_secure', {
            p_company_id: company.id,
          });

          if (profilesError) {
            logger.warn('Could not fetch profiles via get_profiles_secure (continuing):', profilesError);
          } else {
            (profilesData || []).forEach((p: any) => {
              profileById.set(p.id, p);
            });
          }
        } catch (e) {
          logger.warn('Could not fetch profiles (continuing):', e);
        }
      }

      const inviteById = new Map<string, any>();
      if (inviteIds.length > 0) {
        try {
          const { data: invitesData, error: invitesError } = await supabase
            .from('invites')
            .select('id, first_name, last_name, job_title, department, practice_area, location, avatar_url')
            .in('id', inviteIds);

          if (invitesError) {
            logger.warn('Could not fetch invites (continuing):', invitesError);
          } else {
            (invitesData || []).forEach((i: any) => {
              inviteById.set(i.id, i);
            });
          }
        } catch (e) {
          logger.warn('Could not fetch invites (continuing):', e);
        }
      }

      // Format the results to match our Resource interface
      const activeResources: Resource[] = (activeMembers || []).map((member) => {
        const profile = profileById.get(member.staff_id);
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
        const invite = inviteById.get(member.invite_id);
        return {
          id: member.invite_id,
          name: `${invite?.first_name || ''} ${invite?.last_name || ''}`.trim() || 'Pending invite',
          role: invite?.job_title || 'Team Member',
          isPending: true,
          avatar_url: invite?.avatar_url,
          first_name: invite?.first_name,
          last_name: invite?.last_name,
          department: invite?.department,
          practice_area: invite?.practice_area,
          location: invite?.location,
        };
      });

      // Check for allocations that exist without corresponding resource entries
      const { data: orphanedAllocations, error: allocationsError } = await supabase
        .from('project_resource_allocations')
        .select('resource_id, resource_type, hours')
        .eq('project_id', projectId)
        .eq('company_id', company.id);

      if (allocationsError) {
        logger.warn('Could not fetch resource allocations (continuing):', allocationsError);
      }

      // Get unique resource IDs from allocations that aren't in our resource lists
      const existingResourceIds = new Set([...activeResources.map((r) => r.id), ...pendingResources.map((r) => r.id)]);

      const orphanedResourceIds = new Set<string>();
      orphanedAllocations?.forEach((allocation: any) => {
        if (allocation?.resource_id && !existingResourceIds.has(allocation.resource_id)) {
          orphanedResourceIds.add(allocation.resource_id);
        }
      });

      // Build best-effort resources for orphaned IDs
      const orphanedResources: Resource[] = [];
      orphanedResourceIds.forEach((id) => {
        const profile = profileById.get(id);
        const invite = inviteById.get(id);

        if (profile) {
          orphanedResources.push({
            id,
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
        } else if (invite) {
          orphanedResources.push({
            id,
            name: `${invite.first_name || ''} ${invite.last_name || ''}`.trim() || 'Pending invite',
            role: invite.job_title || 'Team Member',
            isPending: true,
            avatar_url: invite.avatar_url,
            first_name: invite.first_name,
            last_name: invite.last_name,
            department: invite.department,
            practice_area: invite.practice_area,
            location: invite.location,
          });
        } else {
          orphanedResources.push({
            id,
            name: 'Unnamed',
            role: 'Team Member',
            isPending: false,
          });
        }
      });

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
  }, [projectId, company?.id, isDemoMode, resources]);

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

