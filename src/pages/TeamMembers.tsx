import React from 'react';
import { StandardLayout } from '@/components/layout/StandardLayout';
import { useUserSession } from '@/hooks/useUserSession';
import { useTeamMembersPermissions } from '@/hooks/team/useTeamMembersPermissions';
import { TeamMembersContent } from '@/components/team-members/TeamMembersContent';
import { TeamMembersLoadingState } from '@/components/team-members/TeamMembersLoadingState';
import { TeamMembersPermissionError } from '@/components/team-members/TeamMembersPermissionError';
import { ModernDashboardHeader } from '@/components/dashboard/ModernDashboardHeader';
import { useTeamMembersData } from '@/hooks/useTeamMembersData';
import { useTeamMembersState } from '@/hooks/useTeamMembersState';
import { useCompany } from '@/context/CompanyContext';
import { useProjects } from '@/hooks/useProjects';
import { useOfficeSettings } from '@/context/OfficeSettingsContext';
import { OfficeSettingsProvider } from '@/context/OfficeSettingsContext';
import AuthGuard from '@/components/AuthGuard';
import { Users } from 'lucide-react';

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
  const { locations } = useOfficeSettings();
  
  // Calculate statistics for header
  const allMembers = [...teamMembers, ...preRegisteredMembers];
  const totalMembers = allMembers.length;
  const totalActiveMembers = teamMembers.length;
  
  // Calculate unique departments
  const departments = new Set(teamMembers.map(member => member.department).filter(Boolean));
  const totalDepartments = departments.size;
  
  const totalLocations = locations.length;
  
  // Calculate active projects for dashboard header
  const activeProjects = projects.filter(project => project.status === 'In Progress').length;
  
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

  return (
    <>
      <ModernDashboardHeader
        totalTeamMembers={totalActiveMembers}
        totalActiveProjects={activeProjects}
        totalOffices={totalLocations}
        utilizationRate={0}
        customIcon={Users}
      />
      <TeamMembersContent userId={userId} />
    </>
  );
};

const TeamMembersPage = () => {
  return (
    <AuthGuard>
      <StandardLayout title="Team Members">
        <OfficeSettingsProvider>
          <TeamMembersPageContent />
        </OfficeSettingsProvider>
      </StandardLayout>
    </AuthGuard>
  );
};

export default TeamMembersPage;
