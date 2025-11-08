import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { StandardizedBadge } from "@/components/ui/standardized-badge";
import { TrendingUp } from 'lucide-react';

interface TeamUtilizationKPIProps {
  utilizationRate?: number;
}

export const TeamUtilizationKPI: React.FC<TeamUtilizationKPIProps> = ({
  utilizationRate = 165
}) => {
  return (
    <Card className="rounded-2xl glass-card glass-hover border-white/20">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0 space-y-2">
            <p className="text-xs font-semibold text-white/90 mb-2 tracking-wide">TEAM UTILIZATION</p>
            <p className="text-3xl font-bold text-white mb-2 tracking-tight">{utilizationRate}%</p>
            <StandardizedBadge variant={utilizationRate > 100 ? "error" : "success"} size="sm" className="glass-card border-white/20">
              {utilizationRate > 100 ? 'Critical' : 'Optimal'}
            </StandardizedBadge>
            <p className="text-sm font-medium text-white/80">Over Capacity</p>
            <p className="text-sm font-medium text-white/80">This Month</p>
          </div>
          <div className="h-10 w-10 rounded-xl glass-card flex items-center justify-center flex-shrink-0 ml-3">
            <TrendingUp className="h-5 w-5 text-white/90" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};