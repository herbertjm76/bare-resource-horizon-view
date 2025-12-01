import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Gauge, Users, Clock } from 'lucide-react';
import { StandardizedHeaderBadge } from '../mobile/components/StandardizedHeaderBadge';
import { UnifiedDashboardData } from '../hooks/useDashboardData';
import { TimeRange } from '../TimeRangeSelector';
import { useAppSettings } from '@/hooks/useAppSettings';

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
      <div className="space-y-0.5">
        <p className="text-xs font-medium text-gray-700">{label}</p>
        <p className="text-xs text-gray-500">{Math.round(value)}h</p>
      </div>
    </div>
  );
};

export const TeamCapacityStatusCard: React.FC<TeamCapacityStatusCardProps> = ({ data, selectedTimeRange }) => {
  const { workWeekHours } = useAppSettings();
  
  const getTimePeriodMultiplier = (): number => {
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
  const totalCapacity = data.teamMembers.reduce((sum, member) => sum + (member.weekly_capacity || workWeekHours), 0) * timePeriodMultiplier;
  const utilizationCapacity = (data.currentUtilizationRate / 100) * totalCapacity;
  const availableCapacity = totalCapacity - utilizationCapacity;
  
  const capacityMetrics = [
    {
      value: utilizationCapacity,
      max: totalCapacity,
      label: 'Utilized',
      color: 'primary'
    },
    {
      value: availableCapacity,
      max: totalCapacity,
      label: 'Available',
      color: 'chart-2'
    },
    {
      value: totalCapacity,
      max: totalCapacity,
      label: 'Total',
      color: 'accent'
    }
  ];

  return (
    <Card className="border-border/40">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Gauge className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-base">Capacity Status</h3>
          </div>
          <StandardizedHeaderBadge>
            {getTimeRangeLabel()}
          </StandardizedHeaderBadge>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {capacityMetrics.map((metric, index) => (
            <CapacityGauge key={index} {...metric} />
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-border/40">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Users className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">Team Size</span>
            </div>
            <span className="font-semibold">{data.teamMembers.length} members</span>
          </div>
        </div>

        {/* Status indicator */}
        <div className="mt-3 flex items-center justify-between p-2 rounded-md bg-muted/30">
          <span className="text-xs text-muted-foreground">Utilization Rate</span>
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${
              data.currentUtilizationRate > 85 ? 'bg-red-500' :
              data.currentUtilizationRate > 70 ? 'bg-yellow-500' :
              'bg-green-500'
            }`} />
            <span className="text-xs font-semibold">
              {Math.round(data.currentUtilizationRate)}%
            </span>
          </div>
        </div>

        {data.currentUtilizationRate > 85 && (
          <div className="mt-3 p-2 rounded-md bg-red-50 border border-red-200">
            <p className="text-xs text-red-700">
              ⚠️ Team capacity is running high. Consider allocating resources carefully or hiring additional team members.
            </p>
          </div>
        )}

        {data.currentUtilizationRate < 50 && (
          <div className="mt-3 p-2 rounded-md bg-blue-50 border border-blue-200">
            <p className="text-xs text-blue-700">
              💡 Team has significant available capacity. Good time to take on new projects or focus on training.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
