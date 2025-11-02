import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from 'lucide-react';
import { BalancedGauge } from "@/components/dashboard/gauges/BalancedGauge";

interface TeamUtilizationCardProps {
  utilizationRate?: number;
  status?: string;
  utilizationStatus?: {
    status: string;
    color: string;
    textColor: string;
  };
}

export const TeamUtilizationCard: React.FC<TeamUtilizationCardProps> = ({
  utilizationRate,
  status,
  utilizationStatus
}) => {
  const actualUtilizationRate = utilizationRate || 150;
  
  const getUtilizationConfig = (rate: number) => {
    if (rate <= 70) {
      return { status: 'Under-utilized', color: '#9ca3af', textColor: 'text-muted-foreground' };
    } else if (rate <= 100) {
      return { status: 'Optimal', color: '#8b5cf6', textColor: 'text-foreground' };
    } else {
      return { status: 'Over Capacity', color: '#8b5cf6', overColor: '#ec4899', textColor: 'text-destructive' };
    }
  };
  
  const config = getUtilizationConfig(actualUtilizationRate);
  const isOverCapacity = actualUtilizationRate > 100;
  
  const createArc = (cx: number, cy: number, r: number, startAngle: number, endAngle: number) => {
    const start = (startAngle - 90) * Math.PI / 180;
    const end = (endAngle - 90) * Math.PI / 180;
    const x1 = cx + r * Math.cos(start);
    const y1 = cy + r * Math.sin(start);
    const x2 = cx + r * Math.cos(end);
    const y2 = cy + r * Math.sin(end);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
  };

  const baseEnd = Math.min(actualUtilizationRate, 100) * 3.6;
  const extra = Math.max(actualUtilizationRate - 100, 0);
  const extraDeg = Math.min(359.999, (extra % 100) * 3.6);
  const fullLoops = Math.floor(extra / 100);

  const renderFullCircle = (
    cx: number,
    cy: number,
    r: number,
    stroke: string,
    strokeWidth: number,
    opacity = 0.35
  ) => (
    <g opacity={opacity}>
      <path d={createArc(cx, cy, r, 0, 180)} fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d={createArc(cx, cy, r, 180, 360)} fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
    </g>
  );
  return (
    <Card className="rounded-2xl bg-white border border-border shadow-sm hover:shadow-md transition-shadow h-full">
      <CardContent className="p-6 h-full flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-brand-violet/10">
            <TrendingUp className="h-5 w-5 text-brand-violet" />
          </div>
          <span className="text-lg font-semibold text-brand-violet">Team Utilization</span>
        </div>
        
        <div className="flex-1 flex flex-col justify-center gap-6">
          <div className="flex flex-col items-center gap-3">
            <div className="text-3xl font-bold text-foreground">
              {Math.round(actualUtilizationRate)}%
            </div>
            <div className={`text-sm font-semibold px-3 py-1 rounded-full bg-background border ${config.textColor}`}>
              {config.status}
            </div>
          </div>

          <div className="px-4">
            <BalancedGauge 
              value={actualUtilizationRate} 
              min={0} 
              mid={100} 
              max={500} 
              height={16}
              showLabels={true}
            />
          </div>
        </div>
        
        <div className="flex justify-center pt-2">
          <Badge variant="outline" className="text-xs bg-card text-muted-foreground border-border shadow-sm">
            This Month
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
