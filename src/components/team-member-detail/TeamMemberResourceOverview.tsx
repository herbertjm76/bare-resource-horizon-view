
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, TrendingUp, Target, CheckCircle } from 'lucide-react';
import { useAppSettings } from '@/hooks/useAppSettings';
import { useResourcePlanningData } from './resource-planning/hooks/useResourcePlanningData';
import { calculatePlanningMetrics, calculateHistoricalMetrics } from './resource-planning/utils/resourcePlanningCalculations';
import { ResourcePlanningMetrics } from './resource-planning/ResourcePlanningMetrics';
import { UtilizationTrendAnalysis } from './resource-planning/UtilizationTrendAnalysis';

interface TeamMemberResourceOverviewProps {
  memberId: string;
}

export const TeamMemberResourceOverview: React.FC<TeamMemberResourceOverviewProps> = ({ memberId }) => {
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

  const { workWeekHours } = useAppSettings();
  const weeklyCapacity = memberProfile?.weekly_capacity || workWeekHours;

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

      {/* Planning Overview Metrics */}
      <ResourcePlanningMetrics
        weeklyCapacity={weeklyCapacity}
        averageFutureUtilization={averageFutureUtilization}
        overallocatedWeeks={overallocatedWeeks}
        activeProjectsCount={activeProjects?.length || 0}
        isLoading={isLoadingAllocationData}
      />

      {/* Utilization Trend Analysis */}
      <UtilizationTrendAnalysis
        historicalUtilization={historicalUtilization}
        historicalAverage={historicalAverage}
        averageFutureUtilization={averageFutureUtilization}
        underutilizedWeeks={underutilizedWeeks}
        overallocatedWeeks={overallocatedWeeks}
        isLoading={isLoadingAllocationData}
      />

      {/* Planning Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-theme-primary" />
            Planning Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoadingAllocationData ? (
            <div className="animate-pulse">
              <div className="h-20 bg-gray-100 rounded-lg mb-2"></div>
            </div>
          ) : (
            <>
              {averageFutureUtilization > 100 && (
                <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <div>
                    <h4 className="font-medium text-red-800">Overallocation Risk</h4>
                    <p className="text-sm text-red-600">
                      Resource is overallocated for {overallocatedWeeks} weeks. Consider redistributing workload.
                    </p>
                  </div>
                </div>
              )}
              
              {averageFutureUtilization < 70 && (
                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-yellow-500" />
                  <div>
                    <h4 className="font-medium text-yellow-800">Capacity Available</h4>
                    <p className="text-sm text-yellow-600">
                      Resource has {underutilizedWeeks} weeks below 80% utilization. Consider additional assignments.
                    </p>
                  </div>
                </div>
              )}
              
              {averageFutureUtilization >= 70 && averageFutureUtilization <= 100 && (
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <h4 className="font-medium text-green-800">Optimal Allocation</h4>
                    <p className="text-sm text-green-600">
                      Resource allocation is well balanced for the planning period.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
