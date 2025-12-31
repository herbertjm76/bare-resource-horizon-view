import React from 'react';
import { Users } from 'lucide-react';
import { StandardLayout } from '@/components/layout/StandardLayout';
import { useUserSession } from '@/hooks/useUserSession';
import { useTeamMembersPermissions } from '@/hooks/team/useTeamMembersPermissions';
import { TeamMembersContent } from '@/components/team-members/TeamMembersContent';
import { TeamMembersLoadingState } from '@/components/team-members/TeamMembersLoadingState';
import { TeamMembersPermissionError } from '@/components/team-members/TeamMembersPermissionError';
import { ModernTeamMembersHeader } from '@/components/team-members/ModernTeamMembersHeader';
import { useTeamMembersData } from '@/hooks/useTeamMembersData';
import { useTeamMembersState } from '@/hooks/useTeamMembersState';
import { useCompany } from '@/context/CompanyContext';
import { useProjects } from '@/hooks/useProjects';
import { useOfficeSettings } from '@/context/OfficeSettingsContext';
import { OfficeSettingsProvider } from '@/context/OfficeSettingsContext';
import AuthGuard from '@/components/AuthGuard';
import { logger } from '@/utils/logger';

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
  
  // Fetch team members data for header statistics
  const { teamMembers } = useTeamMembersData(true);
  const { company } = useCompany();
  const { preRegisteredMembers } = useTeamMembersState(company?.id, 'owner');
  const { projects } = useProjects();
  const { locations, departments } = useOfficeSettings();
  
  // Calculate statistics for header
  const allMembers = [...teamMembers, ...preRegisteredMembers];
  const totalMembers = allMembers.length;
  const totalActiveMembers = teamMembers.length;
  
  // Count departments from office settings (not from team members)
  const totalDepartments = departments.length;
  
  const totalLocations = locations.length;
  
  // Calculate active projects for dashboard header
  const activeProjects = projects.filter(project => project.status === 'In Progress').length;
  
  // Check permissions once when component mounts or userId changes
  React.useEffect(() => {
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
        } catch (error) {
          logger.error('Error during permission check:', error);
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

  return (
    <>
      <ModernTeamMembersHeader
        totalMembers={totalMembers}
        totalActiveMembers={totalActiveMembers}
        totalDepartments={totalDepartments}
        totalLocations={totalLocations}
      />
      <TeamMembersContent userId={userId} />
    </>
  );
};

const TeamMembersPage = () => {
  return (
    <AuthGuard>
      <StandardLayout title="">
        <OfficeSettingsProvider>
          <TeamMembersPageContent />
        </OfficeSettingsProvider>
      </StandardLayout>
    </AuthGuard>
  );
};

export default TeamMembersPage;
