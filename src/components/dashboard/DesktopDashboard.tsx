
import React from 'react';
import { DashboardHeader } from './DashboardHeader';
import { DashboardExecutiveSummary } from './DashboardExecutiveSummary';
import TeamMemberSection from './TeamMemberSection';
import { HolidaysList } from './HolidaysList';
import { EnhancedInsights } from './EnhancedInsights';
import { TeamMember } from './types';
import { Users, TrendingUp, Clock, Target } from 'lucide-react';
import { TimeRange } from './TimeRangeSelector';

interface DesktopDashboardProps {
  teamMembers: TeamMember[];
  invites: any[];
  projects: any[];
  executiveSummaryData: any;
  selectedOffice: string;
  setSelectedOffice: (office: string) => void;
  selectedTimeRange: TimeRange;
  setSelectedTimeRange: (range: TimeRange) => void;
  officeOptions: string[];
}

export const DesktopDashboard: React.FC<DesktopDashboardProps> = ({
  teamMembers,
  invites,
  projects,
  executiveSummaryData,
  selectedOffice,
  setSelectedOffice,
  selectedTimeRange,
  setSelectedTimeRange,
  officeOptions
}) => {
  // Transform executiveSummaryData to match DashboardExecutiveSummary format
  const dashboardMetrics = [
    {
      title: "Team Size",
      value: executiveSummaryData?.teamSize || teamMembers.length,
      subtitle: "Active members",
      icon: <Users className="h-4 w-4" />,
      status: "info" as const,
      progress: 75
    },
    {
      title: "Utilization",
      value: `${executiveSummaryData?.utilizationRate || 0}%`,
      subtitle: "Team utilization",
      icon: <TrendingUp className="h-4 w-4" />,
      status: (executiveSummaryData?.utilizationRate || 0) > 80 ? "good" as const : "warning" as const,
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
      status: "good" as const,
      progress: 60
    }
  ];

  return (
    <div className="space-y-8">
      <DashboardHeader 
        selectedOffice={selectedOffice}
        setSelectedOffice={setSelectedOffice}
        selectedTimeRange={selectedTimeRange}
        setSelectedTimeRange={setSelectedTimeRange}
        officeOptions={officeOptions}
      />
      
      {/* Executive Summary */}
      <DashboardExecutiveSummary 
        title="Executive Summary"
        metrics={dashboardMetrics}
      />
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="xl:col-span-2 space-y-8">
          <TeamMemberSection 
            teamMembers={teamMembers}
            userRole="owner"
            editMode={false}
            setEditMode={() => {}}
            selectedMembers={[]}
            setSelectedMembers={() => {}}
            onEditMember={() => {}}
            onDeleteMember={() => {}}
            onBulkDelete={() => {}}
            onAdd={() => {}}
          />
          <EnhancedInsights 
            utilizationRate={executiveSummaryData?.utilizationRate || 0}
            teamSize={teamMembers.length}
            activeProjects={projects.length}
            selectedTimeRange={selectedTimeRange}
          />
        </div>
        
        {/* Sidebar */}
        <div className="space-y-8">
          <HolidaysList holidays={[]} />
        </div>
      </div>
    </div>
  );
};
