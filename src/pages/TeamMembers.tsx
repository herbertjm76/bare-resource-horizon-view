import React from 'react';
import { StandardLayout } from '@/components/layout/StandardLayout';
import { useUserSession } from '@/hooks/useUserSession';
import { useTeamMembersPermissions } from '@/hooks/team/useTeamMembersPermissions';
import { TeamMembersContent } from '@/components/team-members/TeamMembersContent';
import { TeamMembersLoadingState } from '@/components/team-members/TeamMembersLoadingState';
import { TeamMembersPermissionError } from '@/components/team-members/TeamMembersPermissionError';
import AuthGuard from '@/components/AuthGuard';

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
  React.useEffect(() => {
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
    // Create a wrapper function that matches the expected signature
    const handleRetry = async () => {
      await handleRetryPermission();
    };

    return (
      <TeamMembersPermissionError
        permissionError={permissionError}
        onRetry={handleRetry}
      />
    );
  }

  return <TeamMembersContent userId={userId} />;
};

const TeamMembersPage = () => {
  return (
    <AuthGuard>
      <StandardLayout title="Team Members">
        <TeamMembersPageContent />
      </StandardLayout>
    </AuthGuard>
  );
};

export default TeamMembersPage;
