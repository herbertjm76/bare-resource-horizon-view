import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, TrendingUp, TrendingDown } from 'lucide-react';
import { StandardizedHeaderBadge } from '../mobile/components/StandardizedHeaderBadge';
import { UnifiedDashboardData } from '../hooks/useDashboardData';
import { TimeRange } from '../TimeRangeSelector';
import { useAppSettings } from '@/hooks/useAppSettings';
import { getMemberCapacity } from '@/utils/capacityUtils';

interface WorkloadHeatMapCardProps {
  data: UnifiedDashboardData;
  selectedTimeRange: TimeRange;
}

const getWorkloadColor = (utilization: number) => {
  if (utilization >= 100) return 'bg-theme-primary/70';
  if (utilization >= 70) return 'bg-theme-primary'; 
  if (utilization >= 40) return 'bg-theme-primary/50';
  return 'bg-muted';
};

const getWorkloadLabel = (utilization: number) => {
  if (utilization >= 100) return 'Over Capacity';
  if (utilization >= 70) return 'Optimal';
  if (utilization >= 40) return 'Available';
  return 'Low';
};

export const WorkloadHeatMapCard: React.FC<WorkloadHeatMapCardProps> = ({ data, selectedTimeRange }) => {
  const { workWeekHours } = useAppSettings();
  
  const getTimeRangeLabel = () => {
    switch (selectedTimeRange) {
      case 'week': return 'This Week';
      case 'month': return 'This Month';
      case '3months': return 'This Quarter';
      default: return 'This Month';
    }
  };

  // Use the time-range aware utilization data that's already calculated in the dashboard
  const workloadData = data.transformedStaffData.map(member => ({
    name: member.fullName || 'Unknown',
    utilization: member.utilizationPercentage || 0,
    projects: member.activeProjects || 0,
    capacity: getMemberCapacity(member.weeklyCapacity, workWeekHours)
  }));

  const averageUtilization = workloadData.length > 0 
    ? workloadData.reduce((sum, member) => sum + member.utilization, 0) / workloadData.length 
    : 0;

  const utilizationTrend = data.utilizationTrends.days7 - data.utilizationTrends.days30;

  return (
    <Card className="rounded-2xl border-2 border-border bg-card shadow-sm h-[500px]">
      <CardContent className="p-3 sm:p-6 h-full overflow-hidden flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2" style={{ color: 'hsl(var(--theme-primary))' }}>
            <div className="p-1.5 rounded-lg bg-gradient-modern">
              <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            Workload Heat Map
          </h2>
          <StandardizedHeaderBadge>
            {Math.round(averageUtilization)}% Avg
          </StandardizedHeaderBadge>
        </div>

        <div className="flex-1 overflow-hidden">
          <div className="mb-4 flex items-center gap-2 text-sm">
            <span className="text-gray-600">Team Trend:</span>
            {utilizationTrend > 0 ? (
              <div className="flex items-center gap-1 text-green-600">
                <TrendingUp className="h-3 w-3" />
                <span>+{Math.round(utilizationTrend)}%</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-red-600">
                <TrendingDown className="h-3 w-3" />
                <span>{Math.round(utilizationTrend)}%</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 overflow-y-auto max-h-[300px]">
            {workloadData.map((member, index) => (
              <div
                key={index}
                className="p-3 rounded-lg border border-border bg-card shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm truncate">{member.name}</span>
                  <div className={`w-3 h-3 rounded-full ${getWorkloadColor(member.utilization)}`} />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Utilization</span>
                    <span className="font-medium">{Math.round(member.utilization)}%</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Projects</span>
                    <span className="font-medium">{member.projects}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {getWorkloadLabel(member.utilization)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {workloadData.length === 0 && (
            <div className="flex items-center justify-center h-32 text-gray-500">
              No team member data available
            </div>
          )}

          <div className="mt-4 pt-3 border-t">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-muted" />
                <span>Low</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-theme-primary" />
                <span>Optimal</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-theme-primary/70" />
                <span>Over</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};