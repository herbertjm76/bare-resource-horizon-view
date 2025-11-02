import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from 'lucide-react';

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
        
        <div className="flex-1 flex flex-col items-center justify-center relative p-6">
          <div className="relative w-[200px] h-[200px] mx-auto">
            <svg width="200" height="200" viewBox="0 0 200 200">
              <defs>
                <filter id="innerShadow">
                  <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
                  <feOffset dx="0" dy="2" result="offsetblur"/>
                  <feComponentTransfer>
                    <feFuncA type="linear" slope="0.8"/>
                  </feComponentTransfer>
                  <feMerge>
                    <feMergeNode/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {/* Base ring background */}
              <path
                d={createArc(100, 100, 70, 0, 360)}
                fill="none"
                stroke="rgba(156, 163, 175, 0.15)"
                strokeWidth="18"
                strokeLinecap="round"
              />
              
              {/* Base ring (0-100%) */}
              <path
                d={createArc(100, 100, 70, 0, Math.min(actualUtilizationRate, 100) * 3.6)}
                fill="none"
                stroke={config.color}
                strokeWidth="18"
                strokeLinecap="round"
              />
              
              {/* Overflow ring (>100%) */}
              {isOverCapacity && (
                <g>
                  {fullLoops > 0 && renderFullCircle(100, 100, 78, (config.overColor || config.color), 22, 0.25)}
                  {extraDeg > 0 && (
                    <path
                      d={createArc(100, 100, 78, baseEnd, baseEnd + extraDeg)}
                      fill="none"
                      stroke={config.overColor || config.color}
                      strokeWidth="22"
                      strokeLinecap="round"
                      style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.4))' }}
                    />
                  )}
                </g>
              )}
            </svg>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-4xl font-bold bg-gradient-to-br from-gray-900 to-gray-600 bg-clip-text text-transparent">
                {Math.round(actualUtilizationRate)}%
              </div>
              <div className={`text-xs font-semibold mt-1 px-2 py-0.5 rounded-full bg-white/80 backdrop-blur-sm border ${config.textColor}`}>
                {config.status}
              </div>
            </div>
          </div>

          {/* Modern status legend */}
          <div className="flex justify-center mt-4">
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs bg-card/60 backdrop-blur-sm rounded-full px-3 py-1.5 border border-border max-w-full">
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                <div className="w-2 h-2 rounded-full bg-muted flex-shrink-0" />
                <span className="text-muted-foreground font-medium text-[10px]">Low</span>
              </div>
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                <div className="w-2 h-2 rounded-full bg-brand-violet flex-shrink-0" />
                <span className="text-muted-foreground font-medium text-[10px]">Optimal</span>
              </div>
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                <div className="w-2 h-2 rounded-full bg-brand-violet/70 flex-shrink-0" />
                <span className="text-muted-foreground font-medium text-[10px]">Over</span>
              </div>
            </div>
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
