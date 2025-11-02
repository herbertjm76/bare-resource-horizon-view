import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from 'lucide-react';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';

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
      return {
        status: 'Under-utilized',
        baseColor: '#9ca3af',
        overColor: '#9ca3af',
        textColor: 'text-muted-foreground'
      };
    } else if (rate <= 100) {
      return {
        status: 'Optimal',
        baseColor: '#8b5cf6',
        overColor: '#8b5cf6',
        textColor: 'text-foreground'
      };
    } else {
      return {
        status: 'Over Capacity',
        baseColor: '#8b5cf6',
        overColor: '#ec4899', // Pink for overflow
        textColor: 'text-destructive'
      };
    }
  };
  
  const config = getUtilizationConfig(actualUtilizationRate);
  const isOverCapacity = actualUtilizationRate > 100;
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [chartSize, setChartSize] = React.useState({ w: 0, h: 0 });
  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setChartSize({ w: el.clientWidth, h: el.clientHeight });
    update();
    const ro = new (window as any).ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const renderOverflowCap = () => {
    if (!isOverCapacity || !chartSize.w || !chartSize.h) return null;
    const inner = 72; const outer = 92;
    const minDim = Math.min(chartSize.w, chartSize.h);
    const R = ((inner + outer) / 2) / 100 * (minDim / 2);
    const thickness = (outer - inner) / 100 * (minDim / 2);
    const basePct = Math.min(actualUtilizationRate, 100) / 100;
    const overflowPct = Math.min(Math.max(actualUtilizationRate - 100, 0), 100) / 100;
    const startDeg = 90 - basePct * 360;
    const angleDeg = startDeg - overflowPct * 360;
    const theta = (Math.PI / 180) * angleDeg;
    const cx = chartSize.w / 2 + R * Math.cos(theta);
    const cy = chartSize.h / 2 - R * Math.sin(theta);
    const r = thickness / 2;
    return (
      <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 22 }} width={chartSize.w} height={chartSize.h}>
        <circle cx={cx} cy={cy} r={r} fill={config.overColor} stroke="rgba(0,0,0,0.6)" strokeWidth={1.5} style={{ filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.6))' }} />
      </svg>
    );
  };

  const renderOverflowInnerShadow = () => {
    if (!isOverCapacity || !chartSize.w || !chartSize.h) return null;
    const inner = 72; const outer = 92;
    const minDim = Math.min(chartSize.w, chartSize.h);
    const thickness = (outer - inner) / 100 * (minDim / 2);
    const basePct = Math.min(actualUtilizationRate, 100) / 100;
    const overflowPct = Math.min(Math.max(actualUtilizationRate - 100, 0), 100) / 100;
    const startDeg = 90 - basePct * 360;
    const endDeg = startDeg - overflowPct * 360;
    const r = (inner / 100) * (minDim / 2) + Math.max(1, thickness * 0.25);
    const sw = Math.max(1, thickness * 0.6);
    const largeArc = Math.abs(endDeg - startDeg) > 180 ? 1 : 0;
    const cx = chartSize.w / 2; const cy = chartSize.h / 2;
    const toXY = (deg: number) => {
      const t = (Math.PI / 180) * deg;
      return { x: cx + r * Math.cos(t), y: cy + r * Math.sin(t) };
    };
    const p0 = toXY(startDeg);
    const p1 = toXY(endDeg);
    const d = `M ${p0.x} ${p0.y} A ${r} ${r} 0 ${largeArc} 1 ${p1.x} ${p1.y}`;
    return (
      <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 21 }} width={chartSize.w} height={chartSize.h}>
        <path d={d} fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth={sw} strokeLinecap="round" style={{ filter: 'blur(0.3px)' }} />
      </svg>
    );
  };
  
  // Base ring (0-100%)
  const baseData = [
    {
      name: 'Base',
      value: Math.min(actualUtilizationRate, 100),
      fill: config.baseColor
    }
  ];
  
  // Overflow ring (100%+) - overlaps on top
  const overflowData = [
    {
      name: 'Overflow',
      value: Math.max(0, actualUtilizationRate - 100),
      fill: config.overColor
    }
  ];

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
          <div ref={containerRef} className="relative w-full h-full max-w-[220px] max-h-[220px] mx-auto">
            {/* Base ring (0-100%) */}
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart 
                cx="50%" 
                cy="50%" 
                innerRadius="60%" 
                outerRadius="80%" 
                data={baseData}
                startAngle={90}
                endAngle={-270}
              >
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar
                  background={{ fill: 'rgba(156, 163, 175, 0.15)' }}
                  dataKey="value"
                  cornerRadius={10}
                  fill={config.baseColor}
                  animationDuration={1000}
                />
              </RadialBarChart>
            </ResponsiveContainer>
            
            {/* Overflow ring (100%+) - overlaps outside like Apple Watch */}
            {isOverCapacity && (
              <div className="absolute inset-0" style={{ zIndex: 10 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart 
                    cx="50%" 
                    cy="50%" 
                    innerRadius="72%" 
                    outerRadius="92%" 
                    data={overflowData}
                    startAngle={90 - (Math.min(actualUtilizationRate, 100) / 100) * 360}
                    endAngle={(90 - (Math.min(actualUtilizationRate, 100) / 100) * 360) - 360}
                  >
                    <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                    <RadialBar
                      background={false}
                      dataKey="value"
                      cornerRadius={10}
                      fill={config.overColor}
                      animationDuration={1000}
                      stroke="rgba(0,0,0,0.6)"
                      strokeWidth={3}
                      style={{ 
                        filter: 'drop-shadow(0 -2px 4px rgba(0,0,0,0.7)) drop-shadow(0 0 8px rgba(0,0,0,0.5)) drop-shadow(0 0 20px rgba(236, 72, 153, 0.5))',
                      }}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
            )}
            {renderOverflowCap()}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center">
              <div className="text-4xl font-bold bg-gradient-to-br from-gray-900 to-gray-600 bg-clip-text text-transparent text-center">
                {Math.round(actualUtilizationRate)}%
              </div>
              <div className={`text-xs font-semibold mt-1 px-2 py-0.5 rounded-full bg-white/80 backdrop-blur-sm border text-center ${config.textColor}`}>
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