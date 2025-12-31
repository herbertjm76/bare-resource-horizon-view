
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, UserX, Clock } from 'lucide-react';
import { TeamMemberDetailContent } from '@/components/team-member-detail/TeamMemberDetailContent';
import { useTeamMemberDetail } from '@/hooks/useTeamMemberDetail';
import { StandardLayout } from '@/components/layout/StandardLayout';
import AuthGuard from '@/components/AuthGuard';
import { logger } from '@/utils/logger';

const TeamMemberDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Debug logging for URL parameters
  React.useEffect(() => {
    logger.debug('TeamMemberDetail - URL params:', { id });
    logger.debug('TeamMemberDetail - Current URL:', window.location.href);
  }, [id]);
  
  const { memberData, isLoading, error } = useTeamMemberDetail(id);

  if (isLoading) {
    return (
      <AuthGuard>
        <StandardLayout>
          <div className="flex items-center justify-center h-96">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-theme-primary" />
              <span className="text-lg text-gray-600">Loading team member details...</span>
              <p className="text-sm text-gray-500">This may take a moment</p>
            </div>
          </div>
        </StandardLayout>
      </AuthGuard>
    );
  }

  if (error || !memberData) {
    const isPreRegistered = error?.includes('pre-registered') || error?.includes('not yet activated');
    
    return (
      <AuthGuard>
        <StandardLayout>
          <div className="flex items-center justify-center h-96">
            <div className="text-center space-y-4 max-w-md">
              {isPreRegistered ? (
                <>
                  <div className="flex justify-center">
                    <Clock className="h-16 w-16 text-yellow-500" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-800">
                    Team Member Not Activated
                  </h2>
                  <p className="text-gray-600">
                    This team member has been invited but hasn't activated their account yet. 
                    They will appear here once they complete their registration.
                  </p>
                </>
              ) : (
                <>
                  <div className="flex justify-center">
                    <UserX className="h-16 w-16 text-gray-400" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-800">
                    Team Member Not Found
                  </h2>
                  <p className="text-gray-600">
                    {error || 'The requested team member could not be found.'}
                  </p>
                </>
              )}
              
              <div className="text-sm text-gray-500">
                Member ID: {id || 'No ID provided'}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={() => navigate('/team-members')}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Team Members
                </Button>
              </div>
            </div>
          </div>
        </StandardLayout>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <StandardLayout className="bg-gradient-to-br from-white via-gray-50/30 to-gray-100/20">
        <TeamMemberDetailContent memberData={memberData} />
      </StandardLayout>
    </AuthGuard>
  );
};

export default TeamMemberDetailPage;
