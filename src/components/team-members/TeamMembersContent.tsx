
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useCompany } from '@/context/CompanyContext';
import { useMemberPermissions } from '@/hooks/team/useMemberPermissions';
import { useTeamMembersData } from '@/hooks/useTeamMembersData';
import { useTeamMembersState } from '@/hooks/useTeamMembersState';
import { useTeamMembersRealtime } from '@/hooks/useTeamMembersRealtime';
import { TeamMemberContent } from '@/components/dashboard/TeamMemberContent';
import { logger } from '@/utils/logger';

interface TeamMembersContentProps {
  userId: string | null;
}

export const TeamMembersContent: React.FC<TeamMembersContentProps> = ({ userId }) => {
  const { checkUserPermissions, isChecking, hasPermission, permissionError } = useMemberPermissions();
  const [permissionChecked, setPermissionChecked] = useState(false);
  
  const { company, loading: companyLoading, refreshCompany } = useCompany();
  
  // Check permissions once when component mounts or userId changes
  useEffect(() => {
    const verifyAccess = async () => {
      if (!userId) {
        logger.debug('No user ID available, cannot check permissions');
        return;
      }
      
      // Add a small delay to ensure any session changes are propagated
      setTimeout(async () => {
        logger.debug('Verifying access for user:', userId);
        try {
          const result = await checkUserPermissions();
          logger.debug('Permission check complete with result:', result);
          setPermissionChecked(true);
          
          if (!result.hasPermission) {
            logger.error('Permission denied:', result.error);
            toast.error('Permission check failed: ' + (result.error || 'Unknown error'));
          }
        } catch (error) {
          logger.error('Error during permission check:', error);
          setPermissionChecked(true);
        }
      }, 500);
    };
    
    if (userId && !permissionChecked) {
      verifyAccess();
    }
  }, [userId, checkUserPermissions, permissionChecked]);
  
  // Ensure company data is loaded
  useEffect(() => {
    if (!company && userId) {
      refreshCompany();
    }
  }, [company, userId, refreshCompany]);
  
  // Fetch team members data - passing false since we don't need inactive members
  const {
    teamMembers,
    triggerRefresh,
    forceRefresh,
    isLoading: isTeamMembersLoading,
    error: teamMembersError
  } = useTeamMembersData(false);

  // Fetch user profile
  const {
    data: userProfile,
    isLoading: isProfileLoading,
    error: profileError,
    refetch: refetchProfile
  } = useQuery({
    queryKey: ['userProfile', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
          
        if (error) {
          logger.error('Profile fetch error:', error);
          throw error;
        }
        
        logger.debug('User profile loaded:', data);
        return data;
      } catch (error) {
        logger.error('Error fetching user profile:', error);
        return null;
      }
    },
    enabled: !!userId,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  // Fetch pre-registered members - allow all users to view
  const { preRegisteredMembers } = useTeamMembersState(company?.id, 'member');

  // Combine active members and pre-registered members
  const allMembers = [...teamMembers, ...preRegisteredMembers];

  // Set up realtime subscriptions only after permissions are confirmed and user has access
  useTeamMembersRealtime(
    hasPermission ? (userProfile?.company_id || company?.id) : undefined,
    triggerRefresh,
    forceRefresh
  );
  
  // Show error message if there's an issue
  useEffect(() => {
    if (teamMembersError) {
      toast.error('Failed to load team members data');
    }
    
    if (profileError) {
      toast.error('Failed to load your profile');
    }
  }, [teamMembersError, profileError]);

  const isLoading = isTeamMembersLoading || isProfileLoading || companyLoading || (isChecking && !permissionChecked);

  // Check for errors in session
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      logger.debug("Current session:", data?.session ? "Active" : "None");
      if (data?.session?.user) {
        logger.debug("Session user:", data.session.user.id);
        logger.debug("User metadata:", data.session.user.user_metadata);
      }
    };
    
    checkSession();
  }, []);

  return (
    <TeamMemberContent
      userProfile={userProfile}
      isProfileLoading={isLoading}
      teamMembers={allMembers || []}
      onRefresh={triggerRefresh}
    />
  );
};
