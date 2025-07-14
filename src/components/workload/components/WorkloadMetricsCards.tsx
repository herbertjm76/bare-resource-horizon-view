
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Clock, Users, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { TeamMember } from '@/components/dashboard/types';
import { UtilizationCalculationService } from '@/services/utilizationCalculationService';

interface WorkloadMetricsCardsProps {
  weeklyWorkloadData: Record<string, Record<string, any>>;
  filteredMembers: TeamMember[];
  periodWeeks: number;
}

export const WorkloadMetricsCards: React.FC<WorkloadMetricsCardsProps> = ({
  weeklyWorkloadData,
  filteredMembers,
  periodWeeks
}) => {
  // Calculate workload metrics based on the selected period
  const calculateWorkloadMetrics = () => {
    if (!weeklyWorkloadData || Object.keys(weeklyWorkloadData).length === 0) {
      return {
        totalCapacity: 0,
        totalAllocated: 0,
        utilizationRate: 0,
        overloadedMembers: 0,
        underUtilizedMembers: 0,
        availableHours: 0
      };
    }

    let totalCapacity = 0;
    let totalAllocated = 0;
    let overloadedMembers = 0;
    let underUtilizedMembers = 0;

    filteredMembers.forEach(member => {
      const weeklyCapacity = member.weekly_capacity || 40;
      const memberTotalCapacity = weeklyCapacity * periodWeeks;
      totalCapacity += memberTotalCapacity;

      const memberData = weeklyWorkloadData[member.id] || {};
      const memberTotalAllocated = Object.values(memberData).reduce((sum, week) => sum + (week?.total || 0), 0);
      totalAllocated += memberTotalAllocated;

      const memberUtilization = memberTotalCapacity > 0 ? (memberTotalAllocated / memberTotalCapacity) * 100 : 0;
      
      if (memberUtilization > 100) {
        overloadedMembers++;
      } else if (memberUtilization < 60) {
        underUtilizedMembers++;
      }
    });

    const utilizationRate = totalCapacity > 0 ? Math.round((totalAllocated / totalCapacity) * 100) : 0;
    const availableHours = Math.max(0, totalCapacity - totalAllocated);

    return {
      totalCapacity,
      totalAllocated,
      utilizationRate,
      overloadedMembers,
      underUtilizedMembers,
      availableHours
    };
  };

  const metrics = calculateWorkloadMetrics();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{/* Restored original layout */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <div className="text-sm text-muted-foreground">Team Utilization</div>
            </div>
            <div className="text-2xl font-bold mt-1">{metrics.utilizationRate.toFixed(1)}%</div>
            <Badge variant={UtilizationCalculationService.getUtilizationColor(metrics.utilizationRate) as any}>
              {UtilizationCalculationService.getUtilizationBadgeText(metrics.utilizationRate)}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div className="text-sm text-muted-foreground">Available Hours</div>
            </div>
            <div className="text-2xl font-bold mt-1">{Math.round(metrics.availableHours)}h</div>
            <div className="text-sm text-muted-foreground">
              {periodWeeks} week{periodWeeks > 1 ? 's' : ''}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <div className="text-sm text-muted-foreground">Overloaded</div>
            </div>
            <div className="text-2xl font-bold mt-1">{metrics.overloadedMembers}</div>
            <div className="text-sm text-muted-foreground">team members</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-500" />
              <div className="text-sm text-muted-foreground">Under-utilized</div>
            </div>
            <div className="text-2xl font-bold mt-1">{metrics.underUtilizedMembers}</div>
            <div className="text-sm text-muted-foreground">team members</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
