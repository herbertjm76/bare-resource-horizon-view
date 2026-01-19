/**
 * Centralized data hooks for profiles and invites.
 * These are the single source of truth - all other hooks should consume these.
 * This prevents duplicate network requests across the application.
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useDemoAuth } from '@/hooks/useDemoAuth';
import { useCompanyId } from '@/hooks/useCompanyId';
import { DEMO_TEAM_MEMBERS, DEMO_PRE_REGISTERED } from '@/data/demoData';
import { logger } from '@/utils/logger';

// Cache time constants - shared across all core data hooks
export const CORE_DATA_STALE_TIME = 2 * 60 * 1000; // 2 minutes
export const CORE_DATA_GC_TIME = 10 * 60 * 1000; // 10 minutes

/**
 * Central hook for fetching all company profiles.
 * Use this instead of fetching profiles directly in individual components.
 */
export const useProfiles = () => {
  const { isDemoMode } = useDemoAuth();
  const { companyId, isReady } = useCompanyId();

  return useQuery({
    queryKey: ['core-profiles', companyId, isDemoMode],
    queryFn: async () => {
      if (isDemoMode) {
        logger.debug('useProfiles: Returning demo data');
        return DEMO_TEAM_MEMBERS.map(m => ({
          id: m.id,
          first_name: m.first_name,
          last_name: m.last_name,
          avatar_url: m.avatar_url,
          email: m.email,
          weekly_capacity: m.weekly_capacity,
          department: m.department,
          practice_area: m.practice_area,
          location: m.location,
          job_title: m.job_title,
          office_role_id: m.office_role_id,
          company_id: m.company_id,
        }));
      }

      if (!companyId) {
        logger.debug('useProfiles: No company ID, returning empty');
        return [];
      }

      logger.debug('useProfiles: Fetching from Supabase for company', companyId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url, email, weekly_capacity, department, practice_area, location, job_title, office_role_id, company_id, manager_id, start_date, end_date')
        .eq('company_id', companyId);

      if (error) {
        logger.error('useProfiles: Error fetching profiles', error);
        throw error;
      }

      logger.debug('useProfiles: Fetched', data?.length || 0, 'profiles');
      return data || [];
    },
    enabled: isDemoMode || isReady,
    staleTime: CORE_DATA_STALE_TIME,
    gcTime: CORE_DATA_GC_TIME,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

/**
 * Central hook for fetching all company invites (pre-registered members).
 * Use this instead of fetching invites directly in individual components.
 */
export const useInvites = () => {
  const { isDemoMode } = useDemoAuth();
  const { companyId, isReady } = useCompanyId();

  return useQuery({
    queryKey: ['core-invites', companyId, isDemoMode],
    queryFn: async () => {
      if (isDemoMode) {
        logger.debug('useInvites: Returning demo data');
        return DEMO_PRE_REGISTERED.map(m => ({
          id: m.id,
          first_name: m.first_name,
          last_name: m.last_name,
          avatar_url: (m as any).avatar_url || null,
          email: m.email,
          weekly_capacity: m.weekly_capacity,
          department: m.department,
          practice_area: (m as any).practice_area || null,
          location: m.location,
          job_title: m.job_title,
          company_id: m.company_id,
          invitation_type: m.invitation_type,
          status: m.status,
        }));
      }

      if (!companyId) {
        logger.debug('useInvites: No company ID, returning empty');
        return [];
      }

      logger.debug('useInvites: Fetching from Supabase for company', companyId);

      const { data, error } = await supabase
        .from('invites')
        .select('id, first_name, last_name, avatar_url, email, weekly_capacity, department, practice_area, location, job_title, company_id, invitation_type, status')
        .eq('company_id', companyId)
        .in('invitation_type', ['pre_registered', 'email_invite'])
        .eq('status', 'pending');

      if (error) {
        logger.error('useInvites: Error fetching invites', error);
        throw error;
      }

      logger.debug('useInvites: Fetched', data?.length || 0, 'invites');
      return data || [];
    },
    enabled: isDemoMode || isReady,
    staleTime: CORE_DATA_STALE_TIME,
    gcTime: CORE_DATA_GC_TIME,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

/**
 * Combined hook for getting all team members (profiles + invites).
 * Useful when you need both active and pre-registered members.
 */
export const useAllTeamMembers = () => {
  const { data: profiles = [], isLoading: profilesLoading, error: profilesError } = useProfiles();
  const { data: invites = [], isLoading: invitesLoading, error: invitesError } = useInvites();

  const allMembers = [...profiles, ...invites];

  return {
    profiles,
    invites,
    allMembers,
    isLoading: profilesLoading || invitesLoading,
    error: profilesError || invitesError,
  };
};
