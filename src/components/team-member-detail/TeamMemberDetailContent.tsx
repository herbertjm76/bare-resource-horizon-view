
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, Shield, TrendingUp } from 'lucide-react';
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
  const navigate = useNavigate();
  const userId = useUserSession();

  // Fetch current user's profile to determine role
  const { data: currentUserProfile } = useQuery({
    queryKey: ['currentUserProfile', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();
        
      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }
      
      return data;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });

  const userRole = currentUserProfile?.role || 'member';
  const canViewManagementFeatures = ['owner', 'admin', 'pm'].includes(userRole.toLowerCase());

  return (
    <div className="flex-1 p-4 sm:p-8 bg-gradient-to-br from-white via-gray-50/30 to-gray-100/20">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate('/team-members')}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Team
            </Button>
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-brand-violet" />
              <div>
                <h1 className="text-3xl font-bold text-brand-primary">
                  {`${memberData.first_name || ''} ${memberData.last_name || ''}`.trim() || 'Team Member'}
                </h1>
                <p className="text-gray-600">Resource Planning & Allocation Overview</p>
              </div>
            </div>
          </div>
        </div>

        {/* Member Overview Card - Always visible */}
        <TeamMemberOverview member={memberData} />

        {/* Detailed Insights - Optimized Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-6 w-6 text-brand-violet" />
            <h2 className="text-2xl font-bold text-brand-primary">Detailed Insights</h2>
          </div>
          <TeamMemberDetailInsights memberId={memberData.id} />
        </div>

        {/* Utilization Metrics - Lightweight version */}
        <TeamMemberMetrics memberId={memberData.id} />

        {/* Resource Planning Insights - Optional with lazy loading */}
        {canViewManagementFeatures && (
          <TeamMemberResourcePlanning memberId={memberData.id} />
        )}

        {/* Management Features - Only for admin, owner, or PM */}
        {canViewManagementFeatures ? (
          <TeamMemberProjects memberId={memberData.id} />
        ) : (
          <Card className="border-2 border-orange-200 bg-orange-50">
            <CardContent className="p-6 text-center">
              <Shield className="h-12 w-12 mx-auto text-orange-500 mb-4" />
              <h3 className="text-lg font-semibold text-orange-800 mb-2">
                Project Allocation Details
              </h3>
              <p className="text-orange-700">
                Project allocation and resource planning details are available to managers, admins, and project managers.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Role-based access notice */}
        {!canViewManagementFeatures && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 text-blue-700">
                <Shield className="h-5 w-5" />
                <p className="text-sm">
                  You're viewing insights as a <span className="font-medium">{userRole}</span>. 
                  Some management features are restricted to administrators and project managers.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
