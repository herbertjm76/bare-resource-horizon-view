import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session?.user) {
          setUserId(data.session.user.id);
        }
      } catch (error) {
        console.error("Error getting session:", error);
        toast.error("Failed to authenticate user");
      }
    };

    getSession();
  }, []);

  const { data: userProfile } = useQuery({
    queryKey: ['userProfile', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!userId
  });

  const { data: teamMembers = [], isLoading } = useQuery({
    queryKey: ['teamMembers', userProfile?.company_id],
    queryFn: async () => {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('company_id', userProfile?.company_id)
        .order('created_at', { ascending: false });

      if (error) {
        toast.error('Failed to load team members');
        throw error;
      }

      return profiles.map(profile => {
        const enhancedProfile: Profile = {
          ...profile,
          department: 'General',
          location: 'Remote',
          job_title: 'Team Member'
        };
        return enhancedProfile;
      });
    },
    enabled: !!userProfile?.company_id
  });

  const inviteUrl = userProfile?.company_id 
    ? `${window.location.origin}/join/${userProfile.company_id}`
    : '';

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
            <div className="max-w-6xl mx-auto space-y-8 w-full">
              <div className="flex justify-center">
                <div className="w-full">
                  <h1 className="text-3xl font-bold tracking-tight text-brand-primary text-center mb-8">Members</h1>
                  {userId ? (
                    <TeamManagement
                      teamMembers={teamMembers}
                      inviteUrl={inviteUrl}
                      userRole={userProfile?.role || 'member'}
                    />
                  ) : (
                    <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl">
                      <p className="text-white">Loading authentication details...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default TeamMembersPage;
