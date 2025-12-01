
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp } from 'lucide-react';

interface UtilizationTrendAnalysisProps {
  historicalUtilization: number;
  historicalAverage: number;
  averageFutureUtilization: number;
  underutilizedWeeks: number;
  overallocatedWeeks: number;
  isLoading?: boolean;
}

const getUtilizationColor = (utilization: number) => {
  if (utilization > 100) return 'text-red-600';
  if (utilization > 90) return 'text-orange-600';
  if (utilization > 70) return 'text-green-600';
  return 'text-yellow-600';
};

export const UtilizationTrendAnalysis: React.FC<UtilizationTrendAnalysisProps> = ({
  historicalUtilization,
  historicalAverage,
  averageFutureUtilization,
  underutilizedWeeks,
  overallocatedWeeks,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-theme-primary" />
            Utilization Trend Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3 animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-2/3"></div>
              <div className="flex items-center gap-3">
                <div className="h-6 bg-gray-200 rounded w-12"></div>
                <div className="h-2 bg-gray-200 rounded w-full"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
            
            <div className="space-y-3 animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-2/3"></div>
              <div className="flex items-center gap-3">
                <div className="h-6 bg-gray-200 rounded w-12"></div>
                <div className="h-2 bg-gray-200 rounded w-full"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-theme-primary" />
          Utilization Trend Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="font-medium text-gray-800">Historical Performance (4 weeks)</h4>
            <div className="flex items-center gap-3">
              <div className="text-xl font-bold text-gray-700">{Math.round(historicalUtilization)}%</div>
              <Progress value={historicalUtilization} className="flex-1 h-2" />
            </div>
            <p className="text-sm text-gray-600">Average: {Math.round(historicalAverage)}h/week</p>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium text-gray-800">Future Planning (8 weeks)</h4>
            <div className="flex items-center gap-3">
              <div className={`text-xl font-bold ${getUtilizationColor(averageFutureUtilization)}`}>
                {Math.round(averageFutureUtilization)}%
              </div>
              <Progress value={averageFutureUtilization} className="flex-1 h-2" />
            </div>
            <p className="text-sm text-gray-600">
              {underutilizedWeeks} weeks under 80%, {overallocatedWeeks} weeks over 100%
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
