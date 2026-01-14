
import React from 'react';
import { Shield, Loader2 } from 'lucide-react';
import { TeamMemberDetailHeader } from './TeamMemberDetailHeader';
import { TeamMemberProfileCard } from './TeamMemberProfileCard';
import { TeamMemberBaselineSection } from './TeamMemberBaselineSection';
import { TeamMemberUtilizationChart } from './TeamMemberUtilizationChart';
import { TeamMemberSmartInsights } from './TeamMemberSmartInsights';
import { TeamMemberProjectAllocations } from './TeamMemberProjectAllocations';
import { Card, CardContent } from '@/components/ui/card';
import { useUserSession } from '@/hooks/useUserSession';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useIndividualMemberUtilization } from '@/hooks/useIndividualMemberUtilization';
import { useResourcePlanningData } from './resource-planning/hooks/useResourcePlanningData';
import { useAppSettings } from '@/hooks/useAppSettings';
import { logger } from '@/utils/logger';

interface TeamMemberDetailContentProps {
  memberData: any;
}

export const TeamMemberDetailContent: React.FC<TeamMemberDetailContentProps> = ({
  memberData
}) => {
  const userId = useUserSession();
  const { workWeekHours } = useAppSettings();
  const weeklyCapacity = memberData.weekly_capacity || workWeekHours;
  
  // Get utilization data for chart
  const { utilization, isLoading: isLoadingUtilization } = useIndividualMemberUtilization(memberData.id, weeklyCapacity);
  
  // Get active projects count for baseline
  const { activeProjects } = useResourcePlanningData(memberData.id);

  // Fetch current user's profile to determine role with timeout protection
  const { data: currentUserProfile, isLoading: isLoadingUserProfile } = useQuery({
    queryKey: ['currentUserProfile', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      try {
        const { data, error } = await supabase
          .rpc('get_user_role_secure', { _user_id: userId })
          .abortSignal(controller.signal);
          
        clearTimeout(timeoutId);
        if (error) {
          logger.error('Error fetching user role:', error);
          return null;
        }
        
        logger.debug('User role fetched:', data);
        return { role: data };
      } catch (error) {
        clearTimeout(timeoutId);
        logger.error('Error fetching user profile:', error);
        return null;
      }
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const userRole = currentUserProfile?.role || 'member';
  const canViewManagementFeatures = ['owner', 'admin', 'pm'].includes(userRole.toLowerCase());
  const isAdmin = ['owner', 'admin'].includes(userRole.toLowerCase());
  const isOwnProfile = userId === memberData.id;

  // Show loading state while user profile is being fetched
  if (isLoadingUserProfile) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-theme-primary" />
          <span className="text-lg text-gray-600">Loading permissions...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <TeamMemberDetailHeader />

      {/* Member Profile Card */}
      <TeamMemberProfileCard member={memberData} isAdmin={isAdmin} isOwnProfile={isOwnProfile} />

      {/* Management Features - Only for admin, owner, or PM */}
      {canViewManagementFeatures ? (
        <>
          {/* Baseline Section */}
          <TeamMemberBaselineSection 
            member={memberData} 
            activeProjectsCount={activeProjects?.length || 0}
          />

          {/* 3-Column Layout for Desktop with Fixed Heights */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Column 1: Utilization Analytics */}
            <div className="lg:col-span-1">
              <Card className="rounded-2xl border-2 border-zinc-300 bg-white shadow-sm h-[500px]">
                <CardContent className="p-3 sm:p-6 h-full overflow-hidden">
                  <TeamMemberUtilizationChart 
                    memberId={memberData.id} 
                    weeklyCapacity={weeklyCapacity}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Column 2: Smart Insights */}
            <div className="lg:col-span-1">
              <Card className="rounded-2xl border-2 border-zinc-300 bg-white shadow-sm h-[500px]">
                <CardContent className="p-3 sm:p-6 h-full overflow-hidden">
                  <TeamMemberSmartInsights 
                    memberId={memberData.id}
                    weeklyCapacity={weeklyCapacity}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Column 3: Project Allocations */}
            <div className="lg:col-span-1">
              <Card className="rounded-2xl border-2 border-zinc-300 bg-white shadow-sm h-[500px]">
                <CardContent className="p-3 sm:p-6 h-full overflow-hidden">
                  <TeamMemberProjectAllocations 
                    memberId={memberData.id}
                    weeklyCapacity={weeklyCapacity}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Limited view for regular members */}
          <Card className="border-2 border-orange-200 bg-orange-50">
            <CardContent className="p-6 text-center">
              <Shield className="h-12 w-12 mx-auto text-orange-500 mb-4" />
              <h3 className="text-lg font-semibold text-orange-800 mb-2">
                Advanced Analytics
              </h3>
              <p className="text-orange-700">
                Detailed analytics and resource planning information is available to managers, admins, and project managers.
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
