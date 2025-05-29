
import React from 'react';
import { TeamManagement } from "@/components/dashboard/TeamManagement";
import { Profile } from "@/components/dashboard/types";
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, Loader2, UserX, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

  // Add a retry function for better UX
  const handleRetry = () => {
    console.log('Manual retry triggered by user');
    onRefresh();
  };

  if (isProfileLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-8">
        <Card>
          <CardContent className="p-6 flex items-center justify-center">
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-brand-primary" />
              <p className="text-gray-700">Loading user profile...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="max-w-6xl mx-auto space-y-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 text-amber-600 mb-2">
              <AlertCircle className="h-5 w-5" />
              <p className="font-semibold">Authentication Required</p>
            </div>
            <p className="text-gray-700">You must be logged in to view team members.</p>
            <div className="mt-4">
              <Button onClick={handleRetry}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Debug output to help diagnose issues
  console.log('TeamMemberContent rendering with profile:', userProfile);
  console.log('TeamMemberContent has team members:', teamMembers?.length || 0);
  
  // Ensure teamMembers is always an array
  const safeTeamMembers = Array.isArray(teamMembers) ? teamMembers : [];
  
  // Handle the case where we have user profile but no team members
  if (safeTeamMembers.length === 0) {
    const isAdminOrOwner = userProfile?.role === 'owner' || userProfile?.role === 'admin';
    
    return (
      <div className="max-w-6xl mx-auto space-y-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 text-blue-600 mb-2">
              <UserX className="h-5 w-5" />
              <p className="font-semibold">No Team Members Found</p>
            </div>
            <p className="text-gray-700">
              {isAdminOrOwner 
                ? "You don't have any team members yet. Get started by adding your first team member."
                : "No team members are currently available in your organization."}
            </p>
            <div className="mt-4">
              <Button onClick={handleRetry}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Even with empty team members array, pass it to TeamManagement so it can handle the empty state */}
        <TeamManagement 
          teamMembers={safeTeamMembers} 
          inviteUrl={inviteUrl} 
          userRole={userProfile?.role || 'member'} 
          onRefresh={onRefresh}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <TeamManagement 
        teamMembers={safeTeamMembers} 
        inviteUrl={inviteUrl} 
        userRole={userProfile?.role || 'member'} 
        onRefresh={onRefresh}
      />
    </div>
  );
};
