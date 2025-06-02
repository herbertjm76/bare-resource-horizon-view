
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { AppHeader } from '@/components/AppHeader';
import { TeamMemberDetailContent } from '@/components/team-member-detail/TeamMemberDetailContent';
import { useTeamMemberDetail } from '@/hooks/useTeamMemberDetail';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import AuthGuard from '@/components/AuthGuard';

const HEADER_HEIGHT = 56;

const TeamMemberDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { memberData, isLoading, error } = useTeamMemberDetail(id);

  if (isLoading) {
    return (
      <AuthGuard>
        <SidebarProvider>
          <div className="w-full min-h-screen flex flex-row bg-gradient-to-br from-gray-50 to-white">
            <div className="flex-shrink-0">
              <DashboardSidebar />
            </div>
            <div className="flex-1 flex flex-col">
              <AppHeader />
              <div style={{ height: HEADER_HEIGHT }} />
              <div className="flex-1 flex items-center justify-center">
                <div className="flex items-center gap-3">
                  <Loader2 className="h-6 w-6 animate-spin text-brand-primary" />
                  <span className="text-lg text-gray-600">Loading team member details...</span>
                </div>
              </div>
            </div>
          </div>
        </SidebarProvider>
      </AuthGuard>
    );
  }

  if (error || !memberData) {
    return (
      <AuthGuard>
        <SidebarProvider>
          <div className="w-full min-h-screen flex flex-row bg-gradient-to-br from-gray-50 to-white">
            <div className="flex-shrink-0">
              <DashboardSidebar />
            </div>
            <div className="flex-1 flex flex-col">
              <AppHeader />
              <div style={{ height: HEADER_HEIGHT }} />
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <h2 className="text-2xl font-semibold text-gray-800">Team Member Not Found</h2>
                  <p className="text-gray-600">The requested team member could not be found.</p>
                  <Button onClick={() => navigate('/team-members')} className="bg-brand-primary">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Team Members
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </SidebarProvider>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <SidebarProvider>
        <div className="w-full min-h-screen flex flex-row bg-gradient-to-br from-gray-50 to-white">
          <div className="flex-shrink-0">
            <DashboardSidebar />
          </div>
          <div className="flex-1 flex flex-col">
            <AppHeader />
            <div style={{ height: HEADER_HEIGHT }} />
            <TeamMemberDetailContent memberData={memberData} />
          </div>
        </div>
      </SidebarProvider>
    </AuthGuard>
  );
};

export default TeamMemberDetailPage;
