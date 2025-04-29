
import React, { useState, useEffect, useCallback } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { TeamManagement } from "@/components/dashboard/TeamManagement";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/components/dashboard/types";
import { toast } from "sonner";
import { AppHeader } from '@/components/AppHeader';

const HEADER_HEIGHT = 56;

const TeamMembersPage = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const getSession = async () => {
      try {
        const {
          data
        } = await supabase.auth.getSession();
        if (data.session?.user) {
          setUserId(data.session.user.id);
          console.log('Session found, user ID:', data.session.user.id);
        } else {
          console.log('No active session found');
          toast.error("You must be logged in to access this page");
        }
      } catch (error) {
        console.error("Error getting session:", error);
        toast.error("Failed to authenticate user");
      }
    };
    getSession();
  }, []);

  // Fetch user profile
  const {
    data: userProfile,
    isLoading: isProfileLoading
  } = useQuery({
    queryKey: ['userProfile', userId, refreshTrigger],
    queryFn: async () => {
      console.log('Fetching user profile for ID:', userId);
      const {
        data,
        error
      } = await supabase.from('profiles').select('*').eq('id', userId).single();
      if (error) {
        console.error('Error fetching user profile:', error);
        throw error;
      }
      console.log('User profile fetched:', data);
      return data;
    },
    enabled: !!userId
  });

  // Force refresh function - useful for debugging
  const forceRefresh = useCallback(() => {
    console.log('Force refresh triggered');
    setRefreshTrigger(prev => prev + 1);
  }, []);

  // Fetch team members with refetch capability
  const {
    data: teamMembers = [],
    isLoading,
    refetch: refetchTeamMembers
  } = useQuery({
    queryKey: ['teamMembers', userProfile?.company_id, refreshTrigger],
    queryFn: async () => {
      console.log('Fetching team members, refresh trigger:', refreshTrigger);
      console.log('Company ID for fetch:', userProfile?.company_id);
      
      try {
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('company_id', userProfile?.company_id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Failed to load team members:', error);
          toast.error('Failed to load team members');
          throw error;
        }

        console.log('Fetched profiles:', profiles?.length || 0);
        console.log('Profile data:', profiles);
        return profiles as Profile[];
      } catch (fetchError) {
        console.error('Error in team members fetch function:', fetchError);
        toast.error('Error loading team members');
        return [];
      }
    },
    enabled: !!userProfile?.company_id,
    refetchInterval: false, // Disable polling - we'll use manual refresh and realtime
    staleTime: 0, // Always consider data stale to ensure fresh data on refetch
    refetchOnWindowFocus: true, // Refresh when window gets focus
  });

  // Manual refresh function that can be called from children
  const triggerRefresh = useCallback(() => {
    console.log('Manual refresh triggered');
    setRefreshTrigger(prev => prev + 1);
    // Force immediate refetch
    refetchTeamMembers();
  }, [refetchTeamMembers]);

  // Listen for realtime changes
  useEffect(() => {
    if (!userProfile?.company_id) return;
    
    console.log('Setting up realtime subscription for company:', userProfile.company_id);
    
    // Separate channel for profiles table
    const profilesChannel = supabase
      .channel('profiles-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'profiles',
        filter: `company_id=eq.${userProfile.company_id}`
      }, (payload) => {
        console.log('Detected change in profiles table:', payload);
        
        // If this is an update operation, log the new data
        if (payload.eventType === 'UPDATE') {
          console.log('Profile updated:', payload.new);
        }
        
        triggerRefresh();
      })
      .subscribe((status) => {
        console.log('Profiles subscription status:', status);
      });
      
    // Separate channel for invites table  
    const invitesChannel = supabase
      .channel('invites-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'invites',
        filter: `company_id=eq.${userProfile.company_id}`
      }, (payload) => {
        console.log('Detected change in invites table:', payload);
        
        // If this is an update operation, log the new data
        if (payload.eventType === 'UPDATE') {
          console.log('Invite updated:', payload.new);
        }
        
        triggerRefresh();
      })
      .subscribe((status) => {
        console.log('Invites subscription status:', status);
      });
      
    // Add a debug button to the console for troubleshooting
    if (typeof window !== 'undefined') {
      (window as any).forceTeamMembersRefresh = forceRefresh;
      console.log('Debug function added to window: forceTeamMembersRefresh()');
    }
      
    return () => {
      console.log('Cleaning up realtime subscriptions');
      supabase.removeChannel(profilesChannel);
      supabase.removeChannel(invitesChannel);
      
      if (typeof window !== 'undefined') {
        delete (window as any).forceTeamMembersRefresh;
      }
    };
  }, [userProfile?.company_id, triggerRefresh, forceRefresh]);

  const inviteUrl = userProfile?.company_id ? `${window.location.origin}/join/${userProfile.company_id}` : '';

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
            <div className="max-w-6xl mx-auto space-y-8">
              <h1 className="text-3xl font-bold tracking-tight text-brand-primary">Team Members</h1>
              {isProfileLoading ? (
                <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl">
                  <p className="text-gray-700">Loading user profile...</p>
                </div>
              ) : !userProfile ? (
                <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl">
                  <p className="text-gray-700">You must be logged in to view team members.</p>
                </div>
              ) : (
                <TeamManagement 
                  teamMembers={teamMembers} 
                  inviteUrl={inviteUrl} 
                  userRole={userProfile?.role || 'member'} 
                  onRefresh={triggerRefresh}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default TeamMembersPage;
