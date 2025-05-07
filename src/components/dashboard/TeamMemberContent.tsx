
import React from 'react';
import { TeamManagement } from "@/components/dashboard/TeamManagement";
import { Profile } from "@/components/dashboard/types";
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, Loader2 } from 'lucide-react';

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
        <Card>
          <CardContent className="p-6 flex items-center justify-center">
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-brand-primary" />
              <p className="text-gray-700">Loading user profile...</p>
            </div>
          </CardContent>
        </Card>
      ) : !userProfile ? (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 text-amber-600 mb-2">
              <AlertCircle className="h-5 w-5" />
              <p className="font-semibold">Authentication Required</p>
            </div>
            <p className="text-gray-700">You must be logged in to view team members.</p>
          </CardContent>
        </Card>
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
