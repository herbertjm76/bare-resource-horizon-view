
import React, { useState } from 'react';
import { TeamMember, Profile } from './types';
import { TeamMemberInsightsHighlight } from './TeamMemberInsightsHighlight';
import { TeamManagement } from './TeamManagement';
import { useTeamFilters } from '@/hooks/useTeamFilters';

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
  // Use the team filters hook with search functionality
  const {
    filteredMembers,
    searchQuery,
    setSearchQuery
  } = useTeamFilters(teamMembers);

  if (isProfileLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-violet"></div>
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
  const inviteUrl = userProfile?.company_id 
    ? `${window.location.origin}/join?company=${userProfile.company_id}`
    : `${window.location.origin}/join`;

  // Filter out only active members (Profile types) for TeamManagement using type guard
  const activeMembers: Profile[] = filteredMembers.filter(isProfile);

  return (
    <div className="space-y-6">
      <TeamMemberInsightsHighlight
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      <TeamManagement
        teamMembers={activeMembers}
        inviteUrl={inviteUrl}
        userRole={userProfile?.role || 'member'}
        onRefresh={onRefresh}
      />
    </div>
  );
};
