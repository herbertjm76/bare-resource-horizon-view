
import React from 'react';
import { Profile } from './types';
import { TeamManagement } from './TeamManagement';
import { TeamMemberInsightsHighlight } from './TeamMemberInsightsHighlight';
import { useTeamFilters } from '@/hooks/useTeamFilters';

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
  const { searchQuery, setSearchQuery, filteredMembers } = useTeamFilters(teamMembers);

  // Filter to only include active members (Profile objects) for TeamManagement
  const activeMembers = filteredMembers.filter((member): member is Profile => 
    !('isPending' in member)
  );

  if (isProfileLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Unable to load your profile. Please try refreshing the page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Insights Feature Highlight */}
      <TeamMemberInsightsHighlight
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Team Management */}
      <TeamManagement
        teamMembers={activeMembers}
        inviteUrl="" // This will be handled internally by TeamManagement
        userRole={userProfile.role}
        onRefresh={onRefresh}
      />
    </div>
  );
};
