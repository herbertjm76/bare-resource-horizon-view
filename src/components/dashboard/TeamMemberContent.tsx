
import React, { useState } from 'react';
import { Profile } from './types';
import { TeamMemberInsightsHighlight } from './TeamMemberInsightsHighlight';
import { TeamManagement } from './TeamManagement';
import { useTeamFilters } from '@/hooks/useTeamFilters';

interface TeamMemberContentProps {
  userProfile: any;
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
  const [searchQuery, setSearchQuery] = useState('');
  
  // Use the team filters hook with search functionality
  const {
    filteredMembers,
    searchQuery: filterSearchQuery,
    setSearchQuery: setFilterSearchQuery
  } = useTeamFilters(teamMembers);

  // Sync search queries
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setFilterSearchQuery(value);
  };

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

  return (
    <div className="space-y-6">
      <TeamMemberInsightsHighlight
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />
      
      <TeamManagement
        teamMembers={searchQuery ? filteredMembers : teamMembers}
        inviteUrl={inviteUrl}
        userRole={userProfile?.role || 'member'}
        onRefresh={onRefresh}
      />
    </div>
  );
};
