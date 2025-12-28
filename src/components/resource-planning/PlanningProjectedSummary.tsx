import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Users, CalendarDays, TrendingUp, DollarSign, AlertTriangle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useAppSettings } from '@/hooks/useAppSettings';
import { formatAllocationValue, formatCapacityValue, formatUtilizationSummary } from '@/utils/allocationDisplay';

interface PlanningProjectedSummaryProps {
  totalProjectedHours: number;
  totalTeamCapacity: number;
  weeklyCapacity: number;
  teamMemberCount: number;
  projectCount: number;
  totalBudget?: number;
  showBudget?: boolean;
}

export const PlanningProjectedSummary: React.FC<PlanningProjectedSummaryProps> = ({
  totalProjectedHours,
  totalTeamCapacity,
  weeklyCapacity,
  teamMemberCount,
  projectCount,
  totalBudget = 0,
  showBudget = false
}) => {
  const { displayPreference } = useAppSettings();
  const utilizationRate = totalTeamCapacity > 0 
    ? Math.round((totalProjectedHours / totalTeamCapacity) * 100) 
    : 0;

  const isOverCapacity = utilizationRate > 100;
  const isUnderUtilized = utilizationRate < 70;

  const getUtilizationColor = () => {
    if (isOverCapacity) return 'text-destructive';
    if (utilizationRate > 90) return 'text-orange-500';
    if (utilizationRate > 70) return 'text-green-500';
    return 'text-yellow-500';
  };

  const getProgressColor = () => {
    if (isOverCapacity) return 'bg-destructive';
    if (utilizationRate > 90) return 'bg-orange-500';
    if (utilizationRate > 70) return 'bg-green-500';
    return 'bg-yellow-500';
  };

  return (
    <div className="space-y-4">
      {/* Main Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Clock className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Projected Hours</p>
                <p className="text-xl font-bold">{totalProjectedHours.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Users className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Team Capacity</p>
                <p className="text-xl font-bold">{totalTeamCapacity.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">{formatCapacityValue(weeklyCapacity, displayPreference)}/week</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isOverCapacity ? 'bg-destructive/10' : 'bg-green-500/10'}`}>
                <TrendingUp className={`h-5 w-5 ${getUtilizationColor()}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Utilization</p>
                <p className={`text-xl font-bold ${getUtilizationColor()}`}>
                  {utilizationRate}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <CalendarDays className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Projects</p>
                <p className="text-xl font-bold">{projectCount}</p>
                <p className="text-xs text-muted-foreground">{teamMemberCount} team</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Capacity Bar */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center justify-between">
            <span>Capacity Overview</span>
            {isOverCapacity && (
              <span className="flex items-center gap-1 text-destructive text-xs font-normal">
                <AlertTriangle className="h-3 w-3" />
                Over capacity by {formatAllocationValue(totalProjectedHours - totalTeamCapacity, totalTeamCapacity, displayPreference)}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="relative h-4 w-full overflow-hidden rounded-full bg-muted">
              <div 
                className={`h-full transition-all ${getProgressColor()}`}
                style={{ width: `${Math.min(utilizationRate, 100)}%` }}
              />
              {isOverCapacity && (
                <div 
                  className="absolute top-0 h-full bg-destructive/30 animate-pulse"
                  style={{ 
                    left: `${100 - (utilizationRate - 100)}%`,
                    width: `${Math.min(utilizationRate - 100, 100)}%`
                  }}
                />
              )}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{displayPreference === 'percentage' ? '0%' : '0h'}</span>
              <span>{formatAllocationValue(totalTeamCapacity, totalTeamCapacity, displayPreference)} capacity</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Budget Summary (optional) */}
      {showBudget && totalBudget > 0 && (
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <DollarSign className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Budget</p>
                <p className="text-xl font-bold">${totalBudget.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
