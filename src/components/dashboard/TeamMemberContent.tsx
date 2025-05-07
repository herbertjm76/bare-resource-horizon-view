
import React from 'react';
import { TeamManagement } from "@/components/dashboard/TeamManagement";
import { Profile } from "@/components/dashboard/types";

interface TeamMemberContentProps {
  userProfile: any;
  isProfileLoading: boolean;
  teamMembers: Profile[];
  onRefresh: () => void;
}

export const TeamMemberContent: React.FC<TeamMemberContentProps> = ({
  userProfile,
  isProfileLoading,
  teamMembers,
  onRefresh
}) => {
  const inviteUrl = userProfile?.company_id ? `${window.location.origin}/join/${userProfile.company_id}` : '';

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold tracking-tight text-brand-primary">Team Members</h1>
      {isProfileLoading ? (
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl">
          <p className="text-gray-700">Loading user profile...</p>
        </div>
      ) : !userProfile ? (
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl">
          <p className="text-gray-700">You must be logged in to view team members.</p>
        </div>
      ) : (
        <TeamManagement 
          teamMembers={teamMembers} 
          inviteUrl={inviteUrl} 
          userRole={userProfile?.role || 'member'} 
          onRefresh={onRefresh}
        />
      )}
    </div>
  );
};
