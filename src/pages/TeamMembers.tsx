
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { AppHeader } from '@/components/AppHeader';
import { useUserSession } from '@/hooks/useUserSession';
import { useTeamMembersData } from '@/hooks/useTeamMembersData';
import { useTeamMembersRealtime } from '@/hooks/useTeamMembersRealtime';
import { TeamMemberContent } from '@/components/dashboard/TeamMemberContent';

const HEADER_HEIGHT = 56;

const TeamMembersPage = () => {
  // Get user session
  const userId = useUserSession();
  
  // Fetch team members data
  const {
    userProfile,
    isProfileLoading,
    teamMembers,
    triggerRefresh,
    forceRefresh
  } = useTeamMembersData(userId);

  // Set up realtime subscriptions
  useTeamMembersRealtime(
    userProfile?.company_id,
    triggerRefresh,
    forceRefresh
  );

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
