
import React, { useEffect } from 'react';
import { TeamMember, Profile } from './types';
import { TeamManagement } from './TeamManagement';
import { useTeamMembersPermissions } from '@/hooks/team/useTeamMembersPermissions';

interface TeamMemberContentProps {
  userProfile: any;
  isProfileLoading: boolean;
  teamMembers: TeamMember[];
  onRefresh?: () => void;
}

// Type guard function to check if a TeamMember is a Profile
const isProfile = (member: TeamMember): member is Profile => {
  return !('isPending' in member);
};

export const TeamMemberContent: React.FC<TeamMemberContentProps> = ({
  userProfile,
  isProfileLoading,
  teamMembers,
  onRefresh
}) => {
  const { checkUserPermissions, hasPermission, isChecking } = useTeamMembersPermissions();

  // Filter out only active members (Profile types) for TeamManagement using type guard
  const activeMembers: Profile[] = teamMembers.filter(isProfile);

  // Check permissions on mount
  useEffect(() => {
    checkUserPermissions();
  }, [checkUserPermissions]);

  // Early returns AFTER all hooks
  if (isProfileLoading || isChecking) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-theme-primary"></div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Unable to load your profile information.</p>
      </div>
    );
  }

  // Generate invite URL
  const inviteUrl = userProfile.company_id 
    ? `${window.location.origin}/join?company=${userProfile.company_id}`
    : `${window.location.origin}/join`;
 
  return (
    <div className="space-y-6">
      <TeamManagement
        teamMembers={activeMembers}
        inviteUrl={inviteUrl}
        userRole={hasPermission ? 'admin' : 'member'}
        onRefresh={onRefresh}
      />
    </div>
  );
};
