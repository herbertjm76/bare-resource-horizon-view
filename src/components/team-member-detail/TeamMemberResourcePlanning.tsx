
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { ResourcePlanningMetrics } from './resource-planning/ResourcePlanningMetrics';
import { UtilizationTrendAnalysis } from './resource-planning/UtilizationTrendAnalysis';
import { CurrentProjectAssignments } from './resource-planning/CurrentProjectAssignments';
import { PlanningRecommendations } from './resource-planning/PlanningRecommendations';
import { useResourcePlanningData } from './resource-planning/hooks/useResourcePlanningData';
import { calculatePlanningMetrics, calculateHistoricalMetrics } from './resource-planning/utils/resourcePlanningCalculations';

interface TeamMemberResourcePlanningProps {
  memberId: string;
}

export const TeamMemberResourcePlanning: React.FC<TeamMemberResourcePlanningProps> = ({ memberId }) => {
  const {
    memberProfile,
    futureAllocations,
    historicalData,
    activeProjects,
    isLoading,
    hasError
  } = useResourcePlanningData(memberId);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800">Resource Planning & Allocation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border-2">
              <div className="p-6">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-24 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded animate-pulse w-16 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-32"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800">Resource Planning & Allocation</h2>
        <Card className="border-2 border-red-200 bg-red-50">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-12 w-12 mx-auto text-red-500 mb-3" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              Unable to Load Resource Data
            </h3>
            <p className="text-red-600">
              There was an error loading the resource planning information. Please try refreshing the page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const weeklyCapacity = memberProfile?.weekly_capacity || 40;

  // Calculate planning metrics
  const { averageFutureUtilization, overallocatedWeeks, underutilizedWeeks } = 
    calculatePlanningMetrics(futureAllocations || [], weeklyCapacity);

  // Calculate historical metrics
  const { historicalAverage, historicalUtilization } = 
    calculateHistoricalMetrics(historicalData || [], weeklyCapacity);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Resource Planning & Allocation</h2>

      {/* Planning Overview Metrics */}
      <ResourcePlanningMetrics
        weeklyCapacity={weeklyCapacity}
        averageFutureUtilization={averageFutureUtilization}
        overallocatedWeeks={overallocatedWeeks}
        activeProjectsCount={activeProjects?.length || 0}
      />

      {/* Utilization Trend */}
      <UtilizationTrendAnalysis
        historicalUtilization={historicalUtilization}
        historicalAverage={historicalAverage}
        averageFutureUtilization={averageFutureUtilization}
        underutilizedWeeks={underutilizedWeeks}
        overallocatedWeeks={overallocatedWeeks}
      />

      {/* Current Project Assignments */}
      <CurrentProjectAssignments activeProjects={activeProjects} />

      {/* Resource Planning Recommendations */}
      <PlanningRecommendations
        averageFutureUtilization={averageFutureUtilization}
        overallocatedWeeks={overallocatedWeeks}
        underutilizedWeeks={underutilizedWeeks}
      />
    </div>
  );
};
