
import React from 'react';
import { ExecutiveSummaryCard } from './ExecutiveSummaryCard';
import { StaffStatusCard } from './staff/StaffStatusCard';
import { EnhancedInsights } from './EnhancedInsights';
import { TeamMembersSummary } from './TeamMembersSummary';
import { TimeRange } from './TimeRangeSelector';

interface DesktopDashboardProps {
  teamMembers: any[];
  activeProjects: number;
  activeResources: number;
  utilizationTrends: {
    days7: number;
    days30: number;
    days90: number;
  };
  staffData: Array<{
    id: string;
    name: string;
    availability: number;
    weekly_capacity?: number;
    first_name?: string;
    last_name?: string;
    role?: string;
  }>;
  mockData: any;
  selectedTimeRange: TimeRange;
  totalRevenue?: number;
  avgProjectValue?: number;
  standardizedUtilizationRate?: number;
}

export const DesktopDashboard: React.FC<DesktopDashboardProps> = ({
  teamMembers,
  activeProjects,
  activeResources,
  utilizationTrends,
  staffData,
  mockData,
  selectedTimeRange,
  totalRevenue,
  avgProjectValue,
  standardizedUtilizationRate
}) => {
  // Transform staffData to match StaffMember interface
  const transformedStaffData = staffData.map(member => ({
    ...member,
    first_name: member.first_name || member.name.split(' ')[0] || '',
    last_name: member.last_name || member.name.split(' ').slice(1).join(' ') || '',
    role: member.role || 'Member'
  }));

  return (
    <div className="space-y-6">
      <ExecutiveSummaryCard
        activeProjects={activeProjects}
        activeResources={activeResources}
        utilizationTrends={utilizationTrends}
        selectedTimeRange={selectedTimeRange}
        totalRevenue={totalRevenue}
        avgProjectValue={avgProjectValue}
        staffData={staffData}
        standardizedUtilizationRate={standardizedUtilizationRate}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <StaffStatusCard 
            staffData={transformedStaffData} 
            selectedTimeRange={selectedTimeRange}
          />
        </div>
        <div>
          <EnhancedInsights 
            utilizationRate={standardizedUtilizationRate || 0}
            teamSize={activeResources}
            activeProjects={activeProjects}
            selectedTimeRange={selectedTimeRange}
          />
        </div>
      </div>
      
      <TeamMembersSummary teamMembers={teamMembers} />
    </div>
  );
};
