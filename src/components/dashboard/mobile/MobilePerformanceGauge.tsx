
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
    <Card className="rounded-2xl border-0 shadow-sm bg-gradient-to-br from-gray-50 to-white w-full max-w-full overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <div className="p-1.5 bg-brand-violet/10 rounded-lg flex-shrink-0">
            <Target className="h-4 w-4 text-brand-violet" />
          </div>
          <span className="truncate">Current Performance</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center w-full max-w-full">
        <div className="w-full max-w-full overflow-hidden">
          <Gauge
            value={currentUtilizationRate}
            max={100}
            title="Team Utilization"
            size="lg"
            thresholds={{ good: 60, warning: 80, critical: 90 }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-4 text-center px-2">
          Current week performance vs capacity
        </p>
      </CardContent>
    </Card>
  );
};
