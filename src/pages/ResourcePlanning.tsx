import React, { useState } from 'react';
import { StandardLayout } from '@/components/layout/StandardLayout';
import { StandardizedPageHeader } from '@/components/layout/StandardizedPageHeader';
import { TrendingUp } from 'lucide-react';
import { startOfWeek, addWeeks } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDemandProjection } from '@/hooks/useDemandProjection';
import { useTeamMembersData } from '@/hooks/useTeamMembersData';
import { Skeleton } from '@/components/ui/skeleton';
import { DemandCapacityChart } from '@/components/resource-planning/DemandCapacityChart';
import { ResourcePlanningControls } from '@/components/resource-planning/ResourcePlanningControls';
import { ResourcePlanningMetrics } from '@/components/resource-planning/ResourcePlanningMetrics';

const ResourcePlanning: React.FC = () => {
  const [selectedWeeks, setSelectedWeeks] = useState<number>(12);
  const [startDate, setStartDate] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }));
  
  const { weeklyDemand, roleNames, projectDemands, totalProjectedHours, isLoading: isDemandLoading } = useDemandProjection(
    startDate,
    selectedWeeks
  );
  
  const { teamMembers, isLoading: isTeamLoading } = useTeamMembersData(true);

  // Calculate total team capacity
  const totalTeamCapacity = teamMembers.reduce((sum, member) => {
    return sum + ((member.weekly_capacity || 40) * selectedWeeks);
  }, 0);

  const weeklyCapacity = teamMembers.reduce((sum, member) => sum + (member.weekly_capacity || 40), 0);

  const isLoading = isDemandLoading || isTeamLoading;

  return (
    <StandardLayout>
      <StandardizedPageHeader
        title="Resource Planning"
        description="Forecast resource demand vs capacity based on project team compositions"
        icon={TrendingUp}
      />
      
      <div className="px-6 py-6 space-y-6">
        {/* Controls */}
        <ResourcePlanningControls
          selectedWeeks={selectedWeeks}
          onWeeksChange={setSelectedWeeks}
          startDate={startDate}
          onStartDateChange={setStartDate}
        />

        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-80 w-full" />
          </div>
        ) : (
          <>
            {/* Metrics Cards */}
            <ResourcePlanningMetrics
              totalProjectedHours={totalProjectedHours}
              totalTeamCapacity={totalTeamCapacity}
              weeklyCapacity={weeklyCapacity}
              teamMemberCount={teamMembers.length}
              selectedWeeks={selectedWeeks}
              projectCount={new Set(projectDemands.map(d => d.projectId)).size}
            />

            {/* Main Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Demand vs Capacity Forecast</CardTitle>
              </CardHeader>
              <CardContent>
                <DemandCapacityChart
                  weeklyDemand={weeklyDemand}
                  roleNames={roleNames}
                  weeklyCapacity={weeklyCapacity}
                />
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </StandardLayout>
  );
};

export default ResourcePlanning;
