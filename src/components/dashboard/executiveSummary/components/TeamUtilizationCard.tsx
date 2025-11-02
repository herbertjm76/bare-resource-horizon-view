import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from 'lucide-react';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';

interface TeamUtilizationCardProps {
  utilizationRate: number;
  utilizationStatus: {
    color: string;
    label: string;
  };
}

export const TeamUtilizationCard: React.FC<TeamUtilizationCardProps> = ({
  utilizationRate,
  utilizationStatus
}) => {
  const isOverCapacity = utilizationRate > 100;
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
    const inner = 77; const outer = 97;
    const minDim = Math.min(chartSize.w, chartSize.h);
    const R = ((inner + outer) / 2) / 100 * (minDim / 2);
    const thickness = (outer - inner) / 100 * (minDim / 2);
    const basePct = Math.min(utilizationRate, 100) / 100;
    const overflowPct = Math.min(Math.max(utilizationRate - 100, 0), 100) / 100;
    const startDeg = 90 - basePct * 360;
    const angleDeg = startDeg - overflowPct * 360;
    const theta = (Math.PI / 180) * angleDeg;
    const cx = chartSize.w / 2 + R * Math.cos(theta);
    const cy = chartSize.h / 2 - R * Math.sin(theta);
    const r = thickness / 2;
    return (
      <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 22 }} width={chartSize.w} height={chartSize.h}>
        <circle cx={cx} cy={cy} r={r} fill="#ec4899" stroke="rgba(0,0,0,0.6)" strokeWidth={1.5} style={{ filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.6))' }} />
      </svg>
    );
  };
  
  const baseData = [
    {
      name: 'Base',
      value: Math.min(utilizationRate, 100),
      fill: 'white'
    }
  ];
  
  const overflowData = [
    {
      name: 'Overflow',
      value: Math.max(0, utilizationRate - 100),
      fill: '#ec4899'
    }
  ];

  return (
    <Card className="rounded-xl border-0 shadow-sm h-full" style={{ background: 'linear-gradient(135deg, hsl(var(--brand-violet)), hsl(var(--brand-violet) / 0.8))' }}>
      <CardContent className="p-3 h-full flex flex-col justify-between">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5 text-white/90" />
            <span className="text-[10px] font-medium text-white/90 tracking-wider">TEAM UTILIZATION</span>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col justify-center">
          <div ref={containerRef} className="relative w-16 h-16 mx-auto mb-2">
            {/* Base ring */}
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart 
                cx="50%" 
                cy="50%" 
                innerRadius="65%" 
                outerRadius="85%" 
                data={baseData}
                startAngle={90}
                endAngle={-270}
              >
                <RadialBar
                  background={{ fill: 'rgba(255,255,255,0.15)' }}
                  dataKey="value"
                  cornerRadius={8}
                  fill="white"
                />
              </RadialBarChart>
            </ResponsiveContainer>
            
            {/* Overflow ring - overlaps outside like Apple Watch */}
            {isOverCapacity && (
              <div className="absolute inset-0" style={{ zIndex: 10 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart 
                    cx="50%" 
                    cy="50%" 
                    innerRadius="77%" 
                    outerRadius="97%" 
                    data={overflowData}
                    startAngle={90 - (Math.min(utilizationRate, 100) / 100) * 360}
                    endAngle={(90 - (Math.min(utilizationRate, 100) / 100) * 360) - 360}
                  >
                    <RadialBar
                      background={false}
                      dataKey="value"
                      cornerRadius={8}
                      fill="#ec4899"
                      stroke="rgba(0,0,0,0.6)"
                      strokeWidth={2}
                      style={{ 
                        filter: 'drop-shadow(0 -2px 4px rgba(0,0,0,0.7)) drop-shadow(0 0 8px rgba(0,0,0,0.5)) drop-shadow(0 0 20px rgba(236, 72, 153, 0.5))'
                      }}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
            )}
            
            <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 20 }}>
              <span className="text-lg font-bold text-white">{Math.round(utilizationRate)}%</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <Badge className="text-[10px] border-white/30 text-white bg-white/15 px-2 py-0.5">
            {utilizationStatus.label}
          </Badge>
          <span className="text-[10px] text-white/70">This Month</span>
        </div>
      </CardContent>
    </Card>
  );
};