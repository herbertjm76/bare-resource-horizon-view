import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from 'lucide-react';

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
          <div className="relative w-16 h-16 mx-auto mb-2">
            <svg width="64" height="64" viewBox="0 0 64 64">
              {/* Base ring background */}
              <path
                d={createArc(32, 32, 22, 0, 360)}
                fill="none"
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="6"
                strokeLinecap="round"
              />
              
              {/* Base ring */}
              <path
                d={createArc(32, 32, 22, 0, Math.min(utilizationRate, 100) * 3.6)}
                fill="none"
                stroke="white"
                strokeWidth="6"
                strokeLinecap="round"
              />
              
              {/* Overflow ring */}
              {isOverCapacity && (
                <path
                  d={createArc(32, 32, 25, Math.min(utilizationRate, 100) * 3.6, utilizationRate * 3.6)}
                  fill="none"
                  stroke="#ec4899"
                  strokeWidth="7"
                  strokeLinecap="round"
                  style={{ filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.4))' }}
                />
              )}
            </svg>
            
            <div className="absolute inset-0 flex items-center justify-center">
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
