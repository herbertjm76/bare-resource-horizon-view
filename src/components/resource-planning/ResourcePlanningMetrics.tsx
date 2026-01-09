import React from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp, Users, FolderKanban, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { useAppSettings } from '@/hooks/useAppSettings';
import { formatCapacityValue, formatAllocationValue } from '@/utils/allocationDisplay';

interface ResourcePlanningMetricsProps {
  totalProjectedHours: number;
  totalTeamCapacity: number;
  weeklyCapacity: number;
  teamMemberCount: number;
  selectedWeeks: number;
  projectCount: number;
}

export const ResourcePlanningMetrics: React.FC<ResourcePlanningMetricsProps> = ({
  totalProjectedHours,
  totalTeamCapacity,
  weeklyCapacity,
  teamMemberCount,
  selectedWeeks,
  projectCount
}) => {
  const { displayPreference } = useAppSettings();
  const utilizationPct = totalTeamCapacity > 0 
    ? Math.round((totalProjectedHours / totalTeamCapacity) * 100) 
    : 0;

  const gapHours = totalTeamCapacity - totalProjectedHours;
  const isOverCapacity = gapHours < 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {/* Projected Demand */}
      <Card className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Projected Demand</p>
            <p className="text-2xl font-bold mt-1">{formatAllocationValue(Math.round(totalProjectedHours), totalTeamCapacity, displayPreference)}</p>
            <p className="text-xs text-muted-foreground mt-1">{selectedWeeks} weeks</p>
          </div>
          <TrendingUp className="h-5 w-5 text-muted-foreground" />
        </div>
      </Card>

      {/* Team Capacity */}
      <Card className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Team Capacity</p>
            <p className="text-2xl font-bold mt-1">{formatAllocationValue(Math.round(totalTeamCapacity), totalTeamCapacity, displayPreference)}</p>
            <p className="text-xs text-muted-foreground mt-1">{formatCapacityValue(weeklyCapacity, displayPreference)}/week</p>
          </div>
          <Users className="h-5 w-5 text-muted-foreground" />
        </div>
      </Card>

      {/* Utilization */}
      <Card className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Projected Utilization</p>
            <p className={`text-2xl font-bold mt-1 ${utilizationPct > 100 ? 'text-destructive' : utilizationPct > 80 ? 'text-amber-500' : ''}`}>
              {utilizationPct}%
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {utilizationPct > 100 ? 'Over capacity' : utilizationPct > 80 ? 'Near capacity' : 'Available'}
            </p>
          </div>
          <Clock className="h-5 w-5 text-muted-foreground" />
        </div>
      </Card>

      {/* Gap */}
      <Card className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Capacity Gap</p>
            <p className={`text-2xl font-bold mt-1 ${isOverCapacity ? 'text-destructive' : 'text-green-600'}`}>
              {isOverCapacity ? '-' : '+'}{formatAllocationValue(Math.abs(Math.round(gapHours)), totalTeamCapacity, displayPreference)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {isOverCapacity ? 'Need more resources' : 'Available capacity'}
            </p>
          </div>
          {isOverCapacity ? (
            <AlertTriangle className="h-5 w-5 text-destructive" />
          ) : (
            <CheckCircle className="h-5 w-5 text-green-600" />
          )}
        </div>
      </Card>

      {/* Team Members */}
      <Card className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Team Members</p>
            <p className="text-2xl font-bold mt-1">{teamMemberCount}</p>
            <p className="text-xs text-muted-foreground mt-1">Active resources</p>
          </div>
          <Users className="h-5 w-5 text-muted-foreground" />
        </div>
      </Card>

      {/* Projects */}
      <Card className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Active Projects</p>
            <p className="text-2xl font-bold mt-1">{projectCount}</p>
            <p className="text-xs text-muted-foreground mt-1">With team compositions</p>
          </div>
          <FolderKanban className="h-5 w-5 text-muted-foreground" />
        </div>
      </Card>
    </div>
  );
};
