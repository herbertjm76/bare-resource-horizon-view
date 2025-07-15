import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from 'lucide-react';
import { Gauge } from './Gauge';

interface TeamUtilizationGaugeProps {
  utilizationRate: number;
  size?: 'sm' | 'lg';
  showTitle?: boolean;
}

export const TeamUtilizationGauge: React.FC<TeamUtilizationGaugeProps> = ({
  utilizationRate,
  size = 'lg',
  showTitle = true
}) => {
  return (
    <Card className="rounded-2xl border-0 shadow-sm bg-white">
      {showTitle && (
        <CardHeader className="pb-3 px-4">
          <CardTitle className="text-base flex items-center gap-2">
            <div className="p-1.5 bg-brand-violet/10 rounded-lg flex-shrink-0">
              <Users className="h-4 w-4 text-brand-violet" />
            </div>
            <span className="truncate font-medium">Team Utilization</span>
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className="px-4 pb-4">
        <div className="flex flex-col items-center">
          <Gauge
            value={utilizationRate}
            max={100}
            title="Current Utilization"
            size={size}
            thresholds={{ good: 70, warning: 85, critical: 95 }}
          />
          <p className="text-xs text-gray-600 mt-3 text-center">
            Team performance vs capacity
          </p>
        </div>
      </CardContent>
    </Card>
  );
};