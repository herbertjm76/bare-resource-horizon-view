import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, TrendingUp, TrendingDown } from 'lucide-react';
import { StandardizedHeaderBadge } from '../mobile/components/StandardizedHeaderBadge';
import { UnifiedDashboardData } from '../hooks/useDashboardData';
import { TimeRange } from '../TimeRangeSelector';

interface WorkloadHeatMapCardProps {
  data: UnifiedDashboardData;
  selectedTimeRange: TimeRange;
}

const getWorkloadColor = (utilization: number) => {
  if (utilization >= 95) return 'bg-red-500';
  if (utilization >= 85) return 'bg-orange-500';
  if (utilization >= 70) return 'bg-yellow-500'; 
  if (utilization >= 50) return 'bg-green-500';
  return 'bg-gray-300';
};

const getWorkloadLabel = (utilization: number) => {
  if (utilization >= 95) return 'Overloaded';
  if (utilization >= 85) return 'At Capacity';
  if (utilization >= 70) return 'Optimal';
  if (utilization >= 50) return 'Available';
  return 'Underutilized';
};

export const WorkloadHeatMapCard: React.FC<WorkloadHeatMapCardProps> = ({ data, selectedTimeRange }) => {
  const getTimeRangeLabel = () => {
    switch (selectedTimeRange) {
      case 'week': return 'This Week';
      case 'month': return 'This Month';
      case '3months': return '3 Months';
      case '4months': return '4 Months';
      case '6months': return '6 Months';
      case 'year': return 'This Year';
      default: return 'This Month';
    }
  };

  // Use the time-range aware utilization data that's already calculated in the dashboard
  const workloadData = data.transformedStaffData.map(member => ({
    name: member.fullName || 'Unknown',
    utilization: member.utilizationPercentage || 0,
    projects: member.activeProjects || 0,
    capacity: member.weeklyCapacity || 40
  }));

  const averageUtilization = workloadData.length > 0 
    ? workloadData.reduce((sum, member) => sum + member.utilization, 0) / workloadData.length 
    : 0;

  const utilizationTrend = data.utilizationTrends.days7 - data.utilizationTrends.days30;

  return (
    <Card className="rounded-2xl border-2 border-zinc-300 bg-white shadow-sm h-[500px]">
      <CardContent className="p-3 sm:p-6 h-full overflow-hidden flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-brand-primary flex items-center gap-2">
            <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />
            Team Utilization
          </h2>
          <StandardizedHeaderBadge>
            {getTimeRangeLabel()}
          </StandardizedHeaderBadge>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center">
          {/* Big Thick Circle Gauge */}
          <div className="relative w-48 h-48 mb-6">
            {/* Background circle */}
            <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="35"
                stroke="rgb(229, 231, 235)"
                strokeWidth="12"
                fill="none"
                className="opacity-30"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="35"
                stroke={averageUtilization > 100 ? "rgb(168, 85, 247)" : averageUtilization < 60 ? "rgb(168, 85, 247)" : "rgb(34, 197, 94)"}
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${Math.min(averageUtilization, 150) * 2.2} 220`}
                className="transition-all duration-1000 ease-out"
                style={{
                  filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.3))'
                }}
              />
            </svg>
            
            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-gray-800">
                {Math.round(averageUtilization)}%
              </span>
              <span className="text-sm text-gray-600 font-medium">
                Average Utilization
              </span>
              <div className="flex items-center gap-1 mt-2">
                {utilizationTrend > 0 ? (
                  <div className="flex items-center gap-1 text-green-600">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-sm font-medium">+{Math.round(utilizationTrend)}%</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-red-600">
                    <TrendingDown className="h-4 w-4" />
                    <span className="text-sm font-medium">{Math.round(utilizationTrend)}%</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Team Member Summary Cards */}
          {workloadData.length > 0 ? (
            <div className="w-full">
              <div className="grid grid-cols-2 gap-3 mb-4">
                {workloadData.slice(0, 4).map((member, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-800 truncate">
                        {member.name}
                      </span>
                      <div className={`w-3 h-3 rounded-full ${getWorkloadColor(member.utilization)}`} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-gray-800">
                        {Math.round(member.utilization)}%
                      </span>
                      <span className="text-xs text-gray-600">
                        {member.projects} projects
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {getWorkloadLabel(member.utilization)}
                    </div>
                  </div>
                ))}
              </div>

              {workloadData.length > 4 && (
                <div className="text-center text-sm text-gray-600">
                  +{workloadData.length - 4} more team members
                </div>
              )}
            </div>
          ) : (
            <div className="w-full text-center text-gray-500 text-sm bg-gray-50 rounded-lg p-6">
              No team member data available
            </div>
          )}

          {/* Legend */}
          <div className="mt-6 pt-4 border-t border-gray-200 w-full">
            <div className="flex items-center justify-between text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                <span>Under/Over</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span>Optimal</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-orange-500" />
                <span>At Capacity</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};