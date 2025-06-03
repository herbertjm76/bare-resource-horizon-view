
import React, { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useCompany } from '@/context/CompanyContext';
import { useMemberPermissions } from '@/hooks/team/useMemberPermissions';
import { useTeamMembersData } from '@/hooks/useTeamMembersData';
import { useTeamMembersRealtime } from '@/hooks/useTeamMembersRealtime';
import { TeamMemberContent } from '@/components/dashboard/TeamMemberContent';

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
        console.log('No user ID available, cannot check permissions');
        return;
      }
      
      // Add a small delay to ensure any session changes are propagated
      setTimeout(async () => {
        console.log('Verifying access for user:', userId);
        try {
          const result = await checkUserPermissions();
          console.log('Permission check complete with result:', result);
          setPermissionChecked(true);
          
          if (!result.hasPermission) {
            console.error('Permission denied:', result.error);
            toast.error('Permission check failed: ' + (result.error || 'Unknown error'));
          }
        } catch (error) {
          console.error('Error during permission check:', error);
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
          console.error('Profile fetch error:', error);
          throw error;
        }
        
        console.log('User profile loaded:', data);
        return data;
      } catch (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }
    },
    enabled: !!userId,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  // Set up realtime subscriptions only after permissions are confirmed
  useTeamMembersRealtime(
    userProfile?.company_id || company?.id,
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
      console.log("Current session:", data?.session ? "Active" : "None");
      if (data?.session?.user) {
        console.log("Session user:", data.session.user.id);
        console.log("User metadata:", data.session.user.user_metadata);
      }
    };
    
    checkSession();
  }, []);

  return (
    <div className="flex-1 p-4 sm:p-8 bg-gradient-to-br from-white via-gray-50/30 to-gray-100/20">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Modern Header Section */}
        <div className="space-y-6 mb-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-brand-primary flex items-center gap-3">
                <Users className="h-8 w-8 text-brand-violet" />
                Team Members
              </h1>
            </div>
          </div>
        </div>
        
        <TeamMemberContent
          userProfile={userProfile}
          isProfileLoading={isLoading}
          teamMembers={teamMembers || []}
          onRefresh={triggerRefresh}
        />
      </div>
    </div>
  );
};
