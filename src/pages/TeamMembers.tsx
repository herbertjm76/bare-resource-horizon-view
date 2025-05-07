
import React, { useEffect } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { AppHeader } from '@/components/AppHeader';
import { useUserSession } from '@/hooks/useUserSession';
import { useTeamMembersData } from '@/hooks/useTeamMembersData';
import { useTeamMembersRealtime } from '@/hooks/useTeamMembersRealtime';
import { TeamMemberContent } from '@/components/dashboard/TeamMemberContent';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useCompany } from '@/context/CompanyContext';
import { useAuthorization } from '@/hooks/useAuthorization';

const HEADER_HEIGHT = 56;

const TeamMembersPage = () => {
  // Check user authorization explicitly
  const { isAuthorized, loading: authLoading, userRole } = useAuthorization({
    requiredRole: ['admin', 'owner'],
    autoRedirect: true
  });
  
  // Get user session
  const userId = useUserSession();
  const { company, loading: companyLoading, refreshCompany } = useCompany();
  
  // Ensure company data is loaded
  useEffect(() => {
    if (!company && userId) {
      console.log('Company data missing, refreshing...');
      refreshCompany();
    }
  }, [company, userId, refreshCompany]);
  
  // Fetch team members data - passing false since we don't need inactive members here
  const {
    teamMembers,
    triggerRefresh,
    forceRefresh,
    isLoading: isTeamMembersLoading,
    error: teamMembersError
  } = useTeamMembersData(false);

  // Fetch user profile using the secure RPC function
  const {
    data: userProfile,
    isLoading: isProfileLoading,
    error: profileError
  } = useQuery({
    queryKey: ['userProfile', userId],
    queryFn: async () => {
      if (!userId) return null;
      console.log('Fetching user profile for ID:', userId);
      
      try {
        // Use the RPC function which is secure against RLS recursion
        const { data, error } = await supabase
          .rpc('get_user_profile_by_id', { user_id: userId });
          
        if (error) {
          console.error('Error fetching user profile:', error);
          toast.error('Failed to load your profile');
          throw error;
        }
        
        if (!data || data.length === 0) {
          console.warn('No profile found for user');
          return null;
        }
        
        // Since the RPC returns an array, access the first element
        const profile = Array.isArray(data) ? data[0] : data;
        
        console.log('User profile fetched successfully');
        console.log('Profile data:', profile);
        return profile;
      } catch (error) {
        console.error('Error in profile fetch:', error);
        return null;
      }
    },
    enabled: !!userId,
    retry: 3,
    refetchOnWindowFocus: false,
    refetchOnMount: true, // Always refetch when the component mounts
  });

  // Set up realtime subscriptions
  useTeamMembersRealtime(
    userProfile?.company_id || company?.id,
    triggerRefresh,
    forceRefresh
  );
  
  // Show error message if there's an issue
  useEffect(() => {
    if (teamMembersError) {
      console.error('Team members error:', teamMembersError);
      toast.error('Failed to load team members data');
    }
    
    if (profileError) {
      console.error('Profile error:', profileError);
      toast.error('Failed to load your profile');
    }
  }, [teamMembersError, profileError]);

  // Log important state for debugging
  useEffect(() => {
    console.log('TeamMembers page - User ID:', userId);
    console.log('TeamMembers page - User profile:', userProfile);
    console.log('TeamMembers page - Company from context:', company);
    console.log('TeamMembers page - Team members count:', teamMembers?.length || 0);
  }, [userId, userProfile, company, teamMembers]);

  const isLoading = isTeamMembersLoading || isProfileLoading || companyLoading || authLoading;

  return (
    <SidebarProvider>
      <div className="w-full min-h-screen flex flex-row">
        <div className="flex-shrink-0">
          <DashboardSidebar />
        </div>
        <div className="flex-1 flex flex-col">
          <AppHeader />
          <div style={{ height: HEADER_HEIGHT }} />
          <div className="flex-1 p-4 sm:p-8 bg-background">
            <TeamMemberContent
              userProfile={userProfile}
              isProfileLoading={isLoading}
              teamMembers={teamMembers || []}
              onRefresh={triggerRefresh}
            />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default TeamMembersPage;
