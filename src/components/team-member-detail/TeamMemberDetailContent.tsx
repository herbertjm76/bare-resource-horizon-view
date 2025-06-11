
import React from 'react';
import { Shield, TrendingUp, Loader2 } from 'lucide-react';
import { TeamMemberDetailHeader } from './TeamMemberDetailHeader';
import { TeamMemberOverview } from './TeamMemberOverview';
import { TeamMemberMetrics } from './TeamMemberMetrics';
import { TeamMemberProjects } from './TeamMemberProjects';
import { TeamMemberResourcePlanning } from './TeamMemberResourcePlanning';
import { TeamMemberDetailInsights } from './TeamMemberDetailInsights';
import { Card, CardContent } from '@/components/ui/card';
import { useUserSession } from '@/hooks/useUserSession';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface TeamMemberDetailContentProps {
  memberData: any;
}

export const TeamMemberDetailContent: React.FC<TeamMemberDetailContentProps> = ({
  memberData
}) => {
  const userId = useUserSession();

  // Fetch current user's profile to determine role with timeout protection
  const { data: currentUserProfile, isLoading: isLoadingUserProfile } = useQuery({
    queryKey: ['currentUserProfile', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', userId)
          .abortSignal(controller.signal)
          .single();
          
        clearTimeout(timeoutId);
        if (error) {
          console.error('Error fetching user profile:', error);
          return null;
        }
        
        return data;
      } catch (error) {
        clearTimeout(timeoutId);
        console.error('Error fetching user profile:', error);
        return null;
      }
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const userRole = currentUserProfile?.role || 'member';
  const canViewManagementFeatures = ['owner', 'admin', 'pm'].includes(userRole.toLowerCase());

  // Show loading state while user profile is being fetched
  if (isLoadingUserProfile) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-brand-primary" />
          <span className="text-lg text-gray-600">Loading permissions...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Standardized Header */}
      <TeamMemberDetailHeader memberData={memberData} />

      {/* Member Overview Card - Always visible */}
      <TeamMemberOverview member={memberData} />

      {/* Quick Insights - Lightweight component */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <TrendingUp className="h-6 w-6 text-brand-violet" />
          <h2 className="text-2xl font-bold text-brand-primary">Quick Insights</h2>
        </div>
        <TeamMemberDetailInsights memberId={memberData.id} />
      </div>

      {/* Management Features - Only for admin, owner, or PM */}
      {canViewManagementFeatures ? (
        <>
          {/* Utilization Metrics */}
          <TeamMemberMetrics memberId={memberData.id} />

          {/* Resource Planning - Optimized component */}
          <TeamMemberResourcePlanning memberId={memberData.id} />

          {/* Project Management */}
          <TeamMemberProjects memberId={memberData.id} />
        </>
      ) : (
        <>
          {/* Limited view for regular members */}
          <Card className="border-2 border-orange-200 bg-orange-50">
            <CardContent className="p-6 text-center">
              <Shield className="h-12 w-12 mx-auto text-orange-500 mb-4" />
              <h3 className="text-lg font-semibold text-orange-800 mb-2">
                Detailed Resource Planning
              </h3>
              <p className="text-orange-700">
                Detailed resource planning and project allocation information is available to managers, admins, and project managers.
              </p>
            </CardContent>
          </Card>

          {/* Role-based access notice */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 text-blue-700">
                <Shield className="h-5 w-5" />
                <p className="text-sm">
                  You're viewing this profile as a <span className="font-medium">{userRole}</span>. 
                  Some management features are restricted to administrators and project managers.
                </p>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
