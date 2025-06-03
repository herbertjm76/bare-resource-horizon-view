
import React, { useEffect } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { AppHeader } from '@/components/AppHeader';
import { useUserSession } from '@/hooks/useUserSession';
import { useTeamMembersPermissions } from '@/hooks/team/useTeamMembersPermissions';
import { TeamMembersContent } from '@/components/team-members/TeamMembersContent';
import { TeamMembersLoadingState } from '@/components/team-members/TeamMembersLoadingState';
import { TeamMembersPermissionError } from '@/components/team-members/TeamMembersPermissionError';
import AuthGuard from '@/components/AuthGuard';

const HEADER_HEIGHT = 56;

const TeamMembersPageContent = () => {
  const userId = useUserSession();
  const {
    checkUserPermissions,
    isChecking,
    hasPermission,
    permissionError,
    permissionChecked,
    setPermissionChecked,
    handleRetryPermission
  } = useTeamMembersPermissions();
  
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
        } catch (error) {
          console.error('Error during permission check:', error);
          setPermissionChecked(true);
        }
      }, 500);
    };
    
    if (userId && !permissionChecked) {
      verifyAccess();
    }
  }, [userId, checkUserPermissions, permissionChecked, setPermissionChecked]);

  // Show loading state
  if (isChecking && !permissionChecked) {
    return <TeamMembersLoadingState />;
  }

  // Show permission error state
  if (!hasPermission && permissionChecked) {
    return (
      <TeamMembersPermissionError
        permissionError={permissionError}
        onRetry={handleRetryPermission}
      />
    );
  }

  return <TeamMembersContent userId={userId} />;
};

const TeamMembersPage = () => {
  return (
    <AuthGuard>
      <SidebarProvider>
        <div className="w-full min-h-screen flex flex-row bg-gradient-to-br from-gray-50 to-white">
          <div className="flex-shrink-0">
            <DashboardSidebar />
          </div>
          <div className="flex-1 flex flex-col">
            <AppHeader />
            <div style={{ height: HEADER_HEIGHT }} />
            <TeamMembersPageContent />
          </div>
        </div>
      </SidebarProvider>
    </AuthGuard>
  );
};

export default TeamMembersPage;
