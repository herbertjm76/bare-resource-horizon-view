
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from 'lucide-react';
import { Gauge } from '../Gauge';

interface MobilePerformanceGaugeProps {
  currentUtilizationRate: number;
}

export const MobilePerformanceGauge: React.FC<MobilePerformanceGaugeProps> = ({
  currentUtilizationRate
}) => {
  return (
    <Card className="rounded-2xl border-0 shadow-sm bg-white">
      <CardHeader className="pb-3 px-4">
        <CardTitle className="text-base flex items-center gap-2">
          <div className="p-1.5 bg-brand-violet/10 rounded-lg flex-shrink-0">
            <Target className="h-4 w-4 text-brand-violet" />
          </div>
          <span className="truncate font-medium">Current Performance</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 h-full">
        <div className="flex flex-col items-center justify-center h-full">
          <Gauge
            value={currentUtilizationRate}
            max={100}
            title="Team Utilization"
            size="lg"
            thresholds={{ good: 60, warning: 80, critical: 90 }}
          />
        </div>
      </CardContent>
    </Card>
  );
};
