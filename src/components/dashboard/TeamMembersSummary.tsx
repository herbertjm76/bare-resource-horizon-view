
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TeamMember } from './types';
import { calculateMemberStats, calculateDepartmentStats, calculateLocationStats } from './teamSummary/utils/teamSummaryUtils';
import { TotalMembersSection } from './teamSummary/components/TotalMembersSection';
import { DepartmentsSection } from './teamSummary/components/DepartmentsSection';
import { LocationsSection } from './teamSummary/components/LocationsSection';

interface TeamMembersSummaryProps {
  teamMembers: TeamMember[];
}

export const TeamMembersSummary: React.FC<TeamMembersSummaryProps> = ({
  teamMembers
}) => {
  // Calculate all statistics
  const stats = calculateMemberStats(teamMembers);
  const departmentStats = calculateDepartmentStats(stats.activeMembers);
  const locationStats = calculateLocationStats(stats.activeMembers);

  return (
    <div className="mb-6">
      <Card className="bg-brand-gray text-white border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-white text-xl font-semibold">Team Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Main Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Members */}
            <TotalMembersSection stats={stats} />

            {/* Departments */}
            <DepartmentsSection departmentStats={departmentStats} />

            {/* Locations */}
            <LocationsSection locationStats={locationStats} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
