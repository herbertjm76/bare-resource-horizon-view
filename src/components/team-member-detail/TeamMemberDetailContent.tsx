
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users } from 'lucide-react';
import { TeamMemberOverview } from './TeamMemberOverview';
import { TeamMemberMetrics } from './TeamMemberMetrics';
import { TeamMemberProjects } from './TeamMemberProjects';
import { TeamMemberPerformance } from './TeamMemberPerformance';

interface TeamMemberDetailContentProps {
  memberData: any;
}

export const TeamMemberDetailContent: React.FC<TeamMemberDetailContentProps> = ({
  memberData
}) => {
  const navigate = useNavigate();

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
                <p className="text-gray-600">Resource Management Overview</p>
              </div>
            </div>
          </div>
        </div>

        {/* Member Overview Card */}
        <TeamMemberOverview member={memberData} />

        {/* Metrics Dashboard */}
        <TeamMemberMetrics memberId={memberData.id} />

        {/* Project Allocations */}
        <TeamMemberProjects memberId={memberData.id} />

        {/* Performance Insights */}
        <TeamMemberPerformance memberId={memberData.id} />
      </div>
    </div>
  );
};
