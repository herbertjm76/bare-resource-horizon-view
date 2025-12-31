
import { useCallback, useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/components/dashboard/types";
import { toast } from "sonner";
import { useCompanyId } from '@/hooks/useCompanyId';
import { logger } from '@/utils/logger';

export const useTeamMembersData = (includeInactive: boolean = false) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { companyId, isLoading: companyLoading, isReady } = useCompanyId();

  // Fetch team members with refetch capability
  const {
    data: teamMembers = [],
    isLoading: queryLoading,
    error,
    refetch: refetchTeamMembers
  } = useQuery({
    queryKey: ['teamMembers', refreshTrigger, includeInactive, companyId],
    queryFn: async () => {
      logger.debug('Fetching team members, refresh trigger:', refreshTrigger);
      logger.debug('Include inactive members:', includeInactive);
      logger.debug('Company ID from context:', companyId);
      
      try {
        // First, get the current user's auth data
        const { data: authData } = await supabase.auth.getUser();
        if (!authData.user) {
          logger.error('No authenticated user found');
          return [];
        }
        
        // Get the user's company ID - use from context
        let resolvedCompanyId = companyId;
        
        if (!resolvedCompanyId) {
          // Fallback: query the profiles table
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('company_id')
            .eq('id', authData.user.id)
            .single();
            
          if (profileError) {
            logger.error('Failed to get user company ID:', profileError);
            toast.error('Failed to get company information');
            throw profileError;
          }
          
          resolvedCompanyId = profileData?.company_id;
          if (import.meta.env.DEV) {
            logger.debug('User company ID from query:', resolvedCompanyId);
          }
        }
        
        if (!resolvedCompanyId) {
          logger.error('Cannot fetch team members: No company ID available');
          toast.error('Company information not available');
          return [];
        }
        
        // Fetch profiles
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .eq('company_id', resolvedCompanyId);

        if (profilesError) {
          logger.error('Failed to load team members:', profilesError);
          toast.error('Failed to load team members');
          throw profilesError;
        }

        if (!profiles) {
          logger.warn('No team members found');
          return [];
        }

        if (import.meta.env.DEV) {
          logger.debug('Fetched profiles:', profiles.length || 0);
        }
        
        // Fetch roles from user_roles table for all profiles
        const userIds = profiles.map(p => p.id);
        const { data: userRoles, error: rolesError } = await supabase
          .from('user_roles')
          .select('user_id, role')
          .eq('company_id', resolvedCompanyId)
          .in('user_id', userIds);

        if (rolesError) {
          logger.error('Failed to fetch user roles:', rolesError);
        }

        // Create a map of user_id to role
        const roleMap = new Map<string, string>();
        userRoles?.forEach(ur => {
          // Prefer higher privilege roles (owner > admin > member)
          const existing = roleMap.get(ur.user_id);
          if (!existing || 
              (ur.role === 'owner') || 
              (ur.role === 'admin' && existing === 'member')) {
            roleMap.set(ur.user_id, ur.role);
          }
        });

        // Map profiles to include role from user_roles table
        const profilesWithRoles = profiles.map(profile => ({
          ...profile,
          role: roleMap.get(profile.id) || 'member',
        }));
        
        return profilesWithRoles as Profile[];
      } catch (fetchError) {
        logger.error('Error in team members fetch function:', fetchError);
        toast.error('Error loading team members');
        throw fetchError;
      }
    },
    enabled: isReady,
    refetchInterval: false,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  // Force refresh function - useful for debugging
  const forceRefresh = useCallback(() => {
    logger.debug('Force refresh triggered');
    setRefreshTrigger(prev => prev + 1);
  }, []);

  // Manual refresh function that can be called from children
  const triggerRefresh = useCallback(() => {
    logger.debug('Manual refresh triggered');
    setRefreshTrigger(prev => prev + 1);
    // Force immediate refetch
    refetchTeamMembers();
  }, [refetchTeamMembers]);

  return {
    teamMembers: teamMembers || [],
    isLoading: queryLoading || companyLoading,
    error,
    triggerRefresh,
    forceRefresh,
  };
};
