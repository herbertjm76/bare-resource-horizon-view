
import React, { useState, useEffect } from 'react';
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

const HEADER_HEIGHT = 56;

const TeamMembersPage = () => {
  // Get user session
  const userId = useUserSession();
  
  // Fetch team members data - passing false since we don't need inactive members here
  const {
    teamMembers,
    triggerRefresh,
    forceRefresh,
    isLoading: isTeamMembersLoading,
    error: teamMembersError
  } = useTeamMembersData(false);

  // Fetch user profile separately since it's no longer part of useTeamMembersData
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
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
          
        if (error) {
          console.error('Error fetching user profile:', error);
          toast.error('Failed to load your profile');
          throw error;
        }
        
        console.log('User profile fetched:', data);
        return data;
      } catch (error) {
        console.error('Error in profile fetch:', error);
        return null;
      }
    },
    enabled: !!userId,
    retry: 3
  });

  // Set up realtime subscriptions
  useTeamMembersRealtime(
    userProfile?.company_id,
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
              isProfileLoading={isProfileLoading}
              teamMembers={teamMembers}
              onRefresh={triggerRefresh}
            />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default TeamMembersPage;
