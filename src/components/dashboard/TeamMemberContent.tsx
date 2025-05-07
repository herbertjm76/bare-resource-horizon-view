
import React from 'react';
import { Profile } from './types';
import TeamManagement from './TeamManagement';

interface TeamMemberContentProps {
  userProfile: Profile | null;
  isProfileLoading: boolean;
  teamMembers: Profile[];
  onRefresh?: () => void;
}

export const TeamMemberContent: React.FC<TeamMemberContentProps> = ({
  userProfile,
  isProfileLoading,
  teamMembers,
  onRefresh
}) => {
  // Show loading state if profile is still loading
  if (isProfileLoading) {
    return (
      <div className="py-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
        <p className="text-center mt-4 text-muted-foreground">Loading team details...</p>
      </div>
    );
  }

  // Show message if no profile is found
  if (!userProfile) {
    return (
      <div className="py-8">
        <h1 className="text-2xl font-bold text-center mb-4">Profile Not Found</h1>
        <p className="text-center text-muted-foreground">
          We couldn't find your profile information. Please try logging in again.
        </p>
      </div>
    );
  }

  // Company invitation URL
  const inviteUrl = `${window.location.origin}/join?companyId=${userProfile.company_id}`;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Team Members</h1>
      <TeamManagement
        teamMembers={teamMembers}
        inviteUrl={inviteUrl}
        userRole={userProfile.role}
        onRefresh={onRefresh}
      />
    </div>
  );
};
