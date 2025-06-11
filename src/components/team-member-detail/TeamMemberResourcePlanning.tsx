
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
    isLoadingAllocationData,
    hasError
  } = useResourcePlanningData(memberId);

  // Show skeleton metrics when still loading data
  if (!memberProfile) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800">Resource Planning</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border animate-pulse">
              <div className="p-4">
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-16 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Show error state if there's an error
  if (hasError) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800">Resource Planning</h2>
        <Card className="border border-red-200 bg-red-50">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-8 w-8 mx-auto text-red-500 mb-2" />
            <h3 className="text-lg font-semibold text-red-800 mb-1">
              Unable to Load Resource Data
            </h3>
            <p className="text-sm text-red-600">
              There was an error loading the resource planning information.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const weeklyCapacity = memberProfile?.weekly_capacity || 40;

  // Calculate planning metrics - only when we have allocation data
  const { averageFutureUtilization, overallocatedWeeks, underutilizedWeeks } = 
    isLoadingAllocationData 
      ? { averageFutureUtilization: 0, overallocatedWeeks: 0, underutilizedWeeks: 0 }
      : calculatePlanningMetrics(futureAllocations || [], weeklyCapacity);

  // Calculate historical metrics - only when we have historical data
  const { historicalAverage, historicalUtilization } = 
    isLoadingAllocationData
      ? { historicalAverage: 0, historicalUtilization: 0 }
      : calculateHistoricalMetrics(historicalData || [], weeklyCapacity);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Resource Planning</h2>

      {/* Planning Overview Metrics - with loading state support */}
      <ResourcePlanningMetrics
        weeklyCapacity={weeklyCapacity}
        averageFutureUtilization={averageFutureUtilization}
        overallocatedWeeks={overallocatedWeeks}
        activeProjectsCount={activeProjects?.length || 0}
        isLoading={isLoadingAllocationData}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Utilization Trend */}
        <UtilizationTrendAnalysis
          historicalUtilization={historicalUtilization}
          historicalAverage={historicalAverage}
          averageFutureUtilization={averageFutureUtilization}
          underutilizedWeeks={underutilizedWeeks}
          overallocatedWeeks={overallocatedWeeks}
          isLoading={isLoadingAllocationData}
        />

        {/* Current Project Assignments */}
        <CurrentProjectAssignments 
          activeProjects={activeProjects} 
          isLoading={isLoadingAllocationData} 
        />
      </div>

      {/* Resource Planning Recommendations */}
      <PlanningRecommendations
        averageFutureUtilization={averageFutureUtilization}
        overallocatedWeeks={overallocatedWeeks}
        underutilizedWeeks={underutilizedWeeks}
        isLoading={isLoadingAllocationData}
      />
    </div>
  );
};
