
import React from 'react';
import { DashboardHeader } from './DashboardHeader';
import { DashboardExecutiveSummary } from './DashboardExecutiveSummary';
import { TeamMemberSection } from './TeamMemberSection';
import { HolidaysList } from './HolidaysList';
import { EnhancedInsights } from './EnhancedInsights';
import { TeamMember } from './types';
import { Users, TrendingUp, Clock, Target } from 'lucide-react';

interface MobileDashboardProps {
  teamMembers: TeamMember[];
  invites: any[];
  projects: any[];
  executiveSummaryData: any;
}

export const MobileDashboard: React.FC<MobileDashboardProps> = ({
  teamMembers,
  invites,
  projects,
  executiveSummaryData
}) => {
  // Transform executiveSummaryData to match DashboardExecutiveSummary format
  const dashboardMetrics = [
    {
      title: "Team Size",
      value: executiveSummaryData?.teamSize || teamMembers.length,
      subtitle: "Active members",
      icon: <Users className="h-4 w-4" />,
      status: "info" as const
    },
    {
      title: "Utilization",
      value: `${executiveSummaryData?.utilizationRate || 0}%`,
      subtitle: "Team utilization",
      icon: <TrendingUp className="h-4 w-4" />,
      status: (executiveSummaryData?.utilizationRate || 0) > 80 ? "good" : "warning" as const,
      trend: "up" as const
    },
    {
      title: "Capacity",
      value: `${executiveSummaryData?.totalCapacity || 0}h`,
      subtitle: "Weekly capacity",
      icon: <Clock className="h-4 w-4" />,
      status: "info" as const
    },
    {
      title: "Projects",
      value: projects.length,
      subtitle: "Active projects",
      icon: <Target className="h-4 w-4" />,
      status: "good" as const
    }
  ];

  return (
    <div className="space-y-6">
      <DashboardHeader />
      
      {/* Executive Summary */}
      <DashboardExecutiveSummary 
        title="Executive Summary"
        metrics={dashboardMetrics}
      />
      
      {/* Mobile Layout - Stack everything vertically */}
      <div className="space-y-6">
        <TeamMemberSection 
          teamMembers={teamMembers}
          invites={invites}
        />
        <HolidaysList />
        <EnhancedInsights />
      </div>
    </div>
  );
};
