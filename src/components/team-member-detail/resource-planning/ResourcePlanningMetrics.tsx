
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, TrendingUp, AlertTriangle, Briefcase } from 'lucide-react';
import { useAppSettings } from '@/hooks/useAppSettings';
import { formatCapacityValue } from '@/utils/allocationDisplay';

interface ResourcePlanningMetricsProps {
  weeklyCapacity: number;
  averageFutureUtilization: number;
  overallocatedWeeks: number;
  activeProjectsCount: number;
  isLoading?: boolean;
}

const getUtilizationColor = (utilization: number) => {
  if (utilization > 100) return 'text-red-600';
  if (utilization > 90) return 'text-orange-600';
  if (utilization > 70) return 'text-green-600';
  return 'text-yellow-600';
};

export const ResourcePlanningMetrics: React.FC<ResourcePlanningMetricsProps> = ({
  weeklyCapacity,
  averageFutureUtilization,
  overallocatedWeeks,
  activeProjectsCount,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isLoading = false
}) => {
  const { displayPreference } = useAppSettings();
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
            </CardHeader>
            <CardContent>
              <div className="h-7 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card className="border bg-blue-50 border-blue-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Weekly Capacity</CardTitle>
          <Clock className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            {formatCapacityValue(weeklyCapacity, displayPreference)}
          </div>
          <p className="text-xs text-gray-500 mt-1">Standard weekly capacity</p>
        </CardContent>
      </Card>

      <Card className="border bg-green-50 border-green-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Avg Future Utilization</CardTitle>
          <TrendingUp className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${getUtilizationColor(averageFutureUtilization)}`}>
            {Math.round(averageFutureUtilization)}%
          </div>
          <p className="text-xs text-gray-500 mt-1">Next 8 weeks</p>
        </CardContent>
      </Card>

      <Card className="border bg-orange-50 border-orange-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Overallocated Weeks</CardTitle>
          <AlertTriangle className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">
            {overallocatedWeeks}
          </div>
          <p className="text-xs text-gray-500 mt-1">Above 100% capacity</p>
        </CardContent>
      </Card>

      <Card className="border bg-purple-50 border-purple-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Active Projects</CardTitle>
          <Briefcase className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">
            {activeProjectsCount}
          </div>
          <p className="text-xs text-gray-500 mt-1">Current assignments</p>
        </CardContent>
      </Card>
    </div>
  );
};
