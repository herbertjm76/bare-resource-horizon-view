
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, AlertTriangle, TrendingUp, CheckCircle } from 'lucide-react';

interface PlanningRecommendationsProps {
  averageFutureUtilization: number;
  overallocatedWeeks: number;
  underutilizedWeeks: number;
  isLoading?: boolean;
}

export const PlanningRecommendations: React.FC<PlanningRecommendationsProps> = ({
  averageFutureUtilization,
  overallocatedWeeks,
  underutilizedWeeks,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-brand-violet" />
            Planning Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-20 bg-gray-100 rounded-lg mb-2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-brand-violet" />
          Planning Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
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
      </CardContent>
    </Card>
  );
};
