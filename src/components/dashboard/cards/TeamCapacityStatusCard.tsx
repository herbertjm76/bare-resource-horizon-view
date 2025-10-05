import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Gauge, Users, Clock } from 'lucide-react';
import { StandardizedHeaderBadge } from '../mobile/components/StandardizedHeaderBadge';
import { UnifiedDashboardData } from '../hooks/useDashboardData';
import { TimeRange } from '../TimeRangeSelector';

interface TeamCapacityStatusCardProps {
  data: UnifiedDashboardData;
  selectedTimeRange: TimeRange;
}

const CapacityGauge: React.FC<{ value: number; max: number; label: string; color: string }> = ({ 
  value, 
  max, 
  label, 
  color 
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  return (
    <div className="text-center">
      <div className="relative w-24 h-24 mx-auto mb-2">
        <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
        <div 
          className={`absolute inset-0 rounded-full border-4 border-t-${color}-500 transform -rotate-90`}
          style={{ 
            background: `conic-gradient(from 270deg, hsl(var(--${color})) 0deg ${percentage * 3.6}deg, transparent ${percentage * 3.6}deg)`,
            borderRadius: '50%',
            mask: 'radial-gradient(circle at center, transparent 50%, black 50%)'
          }}
        ></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold">{Math.round(percentage)}%</span>
        </div>
      </div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
};

export const TeamCapacityStatusCard: React.FC<TeamCapacityStatusCardProps> = ({ data, selectedTimeRange }) => {
  // Calculate time period multiplier based on selected time range
  const getTimePeriodMultiplier = () => {
    switch (selectedTimeRange) {
      case 'week':
        return 1;
      case 'month':
        return 4; // ~4 weeks in a month
      case '3months':
        return 13; // ~13 weeks in 3 months
      case '4months':
        return 17; // ~17 weeks in 4 months
      case '6months':
        return 26; // ~26 weeks in 6 months
      case 'year':
        return 52; // 52 weeks in a year
      default:
        return 4;
    }
  };

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

  const timePeriodMultiplier = getTimePeriodMultiplier();
  const totalCapacity = data.teamMembers.reduce((sum, member) => sum + (member.weekly_capacity || 40), 0) * timePeriodMultiplier;
  const utilizationCapacity = (data.currentUtilizationRate / 100) * totalCapacity;
  const availableCapacity = totalCapacity - utilizationCapacity;
  
  const capacityMetrics = [
    {
      label: 'Current Usage',
      value: utilizationCapacity,
      max: totalCapacity,
      color: 'blue'
    },
    {
      label: 'Available',
      value: availableCapacity,
      max: totalCapacity,
      color: 'green'
    },
    {
      label: 'Team Health',
      value: data.currentUtilizationRate < 85 ? 85 : data.currentUtilizationRate,
      max: 100,
      color: data.currentUtilizationRate < 85 ? 'green' : data.currentUtilizationRate < 95 ? 'yellow' : 'red'
    }
  ];

  const getStatusColor = (utilization: number) => {
    if (utilization >= 95) return 'text-red-600 bg-red-50';
    if (utilization >= 85) return 'text-orange-600 bg-orange-50';
    return 'text-green-600 bg-green-50';
  };

  const getStatusText = (utilization: number) => {
    if (utilization >= 95) return 'Overutilized';
    if (utilization >= 85) return 'At Capacity';
    return 'Healthy';
  };

  return (
    <Card className="rounded-2xl border-2 border-zinc-300 bg-white shadow-sm h-[500px]">
      <CardContent className="p-3 sm:p-6 h-full overflow-hidden flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2" style={{ color: 'hsl(var(--theme-primary))' }}>
            <div className="p-1.5 rounded-lg bg-gradient-modern">
              <Gauge className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            Team Capacity
          </h2>
          <StandardizedHeaderBadge>
            {data.totalTeamSize} Members
          </StandardizedHeaderBadge>
        </div>

        <div className="flex-1 space-y-6">
          <div className="grid grid-cols-3 gap-4">
            {capacityMetrics.map((metric, index) => (
              <CapacityGauge
                key={index}
                value={metric.value}
                max={metric.max}
                label={metric.label}
                color={metric.color}
              />
            ))}
          </div>

          <div className="space-y-4">
            <div className={`p-4 rounded-lg ${getStatusColor(data.currentUtilizationRate)}`}>
              <div className="flex items-center justify-between">
                <span className="font-medium">Team Status</span>
                <span className="text-sm font-semibold">{getStatusText(data.currentUtilizationRate)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Active Members</span>
                </div>
                <span className="text-lg font-bold">{data.teamMembers.length}</span>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Weekly Hours</span>
                </div>
                <span className="text-lg font-bold">{totalCapacity}h</span>
              </div>
            </div>

            <div className="text-xs text-gray-600">
              <div className="flex justify-between mb-1">
                <span>Utilization Trend (7d)</span>
                <span className={data.utilizationTrends.days7 > data.utilizationTrends.days30 ? 'text-red-600' : 'text-green-600'}>
                  {data.utilizationTrends.days7 > data.utilizationTrends.days30 ? '↗' : '↘'} 
                  {Math.abs(data.utilizationTrends.days7 - data.utilizationTrends.days30).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};