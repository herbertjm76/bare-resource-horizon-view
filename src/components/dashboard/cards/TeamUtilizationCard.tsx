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
  // Determine status and color based on utilization rate, fallback to reasonable default
  const finalStatus = status || utilizationStatus?.status || (utilizationRate && utilizationRate > 100 ? "Over Capacity" : "Optimal");
  const actualUtilizationRate = utilizationRate || 75; // Show a reasonable default while loading
  
  // Calculate full circle progress (360 degrees)
  const normalizedRate = Math.min(actualUtilizationRate, 200) / 200; // Cap at 200% for display
  const radius = 85;
  const strokeWidth = 20;
  const circumference = 2 * Math.PI * radius; // Full circle circumference
  const strokeDashoffset = circumference - (normalizedRate * circumference);

  return (
    <Card className="rounded-2xl bg-card-gradient-1 border border-gray-200 shadow-sm hover:shadow-md transition-shadow h-full">
      <CardContent className="p-0 h-full flex flex-col">
        <div className="flex items-center justify-between p-4 pb-0">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-gray-600" />
            <span className="text-xs font-semibold text-gray-700 tracking-wide">TEAM UTILIZATION</span>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center relative">
          {/* Full Circle Gauge */}
          <div className="relative flex items-center justify-center w-full h-full">
            <svg width="200" height="200" viewBox="0 0 200 200" className="w-full h-full max-w-[200px] max-h-[200px]">
              {/* Background circle */}
              <circle
                cx="100"
                cy="100"
                r={radius}
                fill="none"
                stroke="#e5e7eb"
                strokeWidth={strokeWidth}
              />
              
              {/* Percentage markers */}
              {[0, 25, 50, 75, 100].map((percent) => {
                const angle = (percent / 100) * 360 - 90; // Start from top
                const x1 = 100 + (radius - 10) * Math.cos(angle * Math.PI / 180);
                const y1 = 100 + (radius - 10) * Math.sin(angle * Math.PI / 180);
                const x2 = 100 + (radius + 5) * Math.cos(angle * Math.PI / 180);
                const y2 = 100 + (radius + 5) * Math.sin(angle * Math.PI / 180);
                const textX = 100 + (radius + 15) * Math.cos(angle * Math.PI / 180);
                const textY = 100 + (radius + 15) * Math.sin(angle * Math.PI / 180);
                
                return (
                  <g key={percent}>
                    <line
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="#8b5cf6"
                      strokeWidth="2"
                    />
                    <text
                      x={textX}
                      y={textY}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-xs font-medium fill-gray-600"
                    >
                      {percent}%
                    </text>
                  </g>
                );
              })}
              
              {/* Progress circle */}
              <circle
                cx="100"
                cy="100"
                r={radius}
                fill="none"
                stroke="#8b5cf6"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-700 ease-out"
                transform="rotate(-90 100 100)"
                style={{
                  filter: 'drop-shadow(0 4px 8px rgba(139, 92, 246, 0.3))'
                }}
              />
            </svg>
            
            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-4xl font-bold text-foreground mb-2">{Math.round(actualUtilizationRate)}%</div>
              <Badge className="text-xs bg-background/50 text-muted-foreground border-muted">
                {finalStatus}
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center p-4 pt-0">
          <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600 border-gray-200">
            This Month
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};