
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Briefcase, TrendingUp, Target } from 'lucide-react';
import { useResourcePlanningData } from './resource-planning/hooks/useResourcePlanningData';
import { useAppSettings } from '@/hooks/useAppSettings';
import { formatCapacityValue } from '@/utils/allocationDisplay';
import { getMemberCapacity } from '@/utils/capacityUtils';

interface TeamMemberInsightsGridProps {
  memberId: string;
}

export const TeamMemberInsightsGrid: React.FC<TeamMemberInsightsGridProps> = ({ memberId }) => {
  const { memberProfile, historicalData, activeProjects, isLoading } = useResourcePlanningData(memberId);
  const { displayPreference, workWeekHours } = useAppSettings();
  
  const weeklyCapacity = getMemberCapacity(memberProfile?.weekly_capacity, workWeekHours);
  
  // Calculate quick metrics - historicalData now uses allocation_date
  const currentWeekUtilization = historicalData[0]?.hours 
    ? (historicalData[0].hours / weeklyCapacity) * 100 
    : 0;
  
  const fourWeekTotal = historicalData.slice(0, 4).reduce((sum, item) => sum + (item.hours || 0), 0);
  const fourWeekAverage = historicalData.length > 0 
    ? (fourWeekTotal / Math.min(4, historicalData.length)) / weeklyCapacity * 100
    : 0;

  const getUtilizationColor = (utilization: number) => {
    if (utilization > 100) return 'text-red-600 bg-red-50 border-red-200'; // Over-allocated
    if (utilization >= 80) return 'text-green-600 bg-green-50 border-green-200'; // Optimal (80-100%)
    if (utilization >= 50) return 'text-yellow-600 bg-yellow-50 border-yellow-200'; // Moderate (50-79%)
    if (utilization > 0) return 'text-orange-600 bg-orange-50 border-orange-200'; // Underutilized (<50%)
    return 'text-gray-600 bg-gray-50 border-gray-200'; // No allocation
  };
  
  if (isLoading || !memberProfile) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse bg-gray-50">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Weekly Capacity */}
      <Card className="border-2 bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4 text-blue-700">
            <Clock className="h-5 w-5" />
            <h3 className="font-medium">Weekly Capacity</h3>
          </div>
          <div className="text-3xl font-bold text-blue-700 mb-1">{formatCapacityValue(weeklyCapacity, displayPreference)}</div>
          <p className="text-sm text-blue-600">Standard allocation</p>
        </CardContent>
      </Card>
      
      {/* Current Utilization */}
      <Card className={`border-2 ${getUtilizationColor(currentWeekUtilization)}`}>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-5 w-5" />
            <h3 className="font-medium">Current Week</h3>
          </div>
          <div className="text-3xl font-bold mb-1">{Math.round(currentWeekUtilization)}%</div>
          <p className="text-sm">Utilization rate</p>
        </CardContent>
      </Card>
      
      {/* Active Projects */}
      <Card className="border-2 bg-green-50 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4 text-green-700">
            <Briefcase className="h-5 w-5" />
            <h3 className="font-medium">Active Projects</h3>
          </div>
          <div className="text-3xl font-bold text-green-700 mb-1">{activeProjects?.length || 0}</div>
          <p className="text-sm text-green-600">Current assignments</p>
        </CardContent>
      </Card>
      
      {/* 4-Week Average */}
      <Card className={`border-2 ${getUtilizationColor(fourWeekAverage)}`}>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5" />
            <h3 className="font-medium">4-Week Trend</h3>
          </div>
          <div className="text-3xl font-bold mb-1">{Math.round(fourWeekAverage)}%</div>
          <p className="text-sm">Average utilization</p>
        </CardContent>
      </Card>
    </div>
  );
};
