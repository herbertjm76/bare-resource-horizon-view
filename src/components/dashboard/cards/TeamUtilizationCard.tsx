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
  
  // Calculate overlapping circles for high utilization
  const completeCircles = Math.floor(actualUtilizationRate / 100); // How many complete 100% circles
  const remainderPercent = actualUtilizationRate % 100; // Remaining percentage for partial circle
  const radius = 70;
  const strokeWidth = 16;
  const circumference = 2 * Math.PI * radius;
  const remainderOffset = circumference - (remainderPercent / 100 * circumference);
  const centerPoint = 120;
  const svgSize = 240;

  return (
    <Card className="rounded-2xl bg-card-gradient-1 border border-gray-200 shadow-sm hover:shadow-md transition-shadow h-full">
      <CardContent className="p-0 h-full flex flex-col">
        <div className="flex items-center justify-between p-4 pb-0">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-gray-600" />
            <span className="text-xs font-semibold text-gray-700 tracking-wide">TEAM UTILIZATION</span>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center relative p-4">
          {/* Full Circle Gauge */}
          <div className="relative flex items-center justify-center w-full h-full">
            <svg 
              width={svgSize} 
              height={svgSize} 
              viewBox={`0 0 ${svgSize} ${svgSize}`} 
              className="w-full h-full max-w-[240px] max-h-[240px]"
            >
              {/* Background circle */}
              <circle
                cx={centerPoint}
                cy={centerPoint}
                r={radius}
                fill="none"
                stroke="#e5e7eb"
                strokeWidth={strokeWidth}
              />
              
              {/* Percentage markers */}
              {[0, 25, 50, 75, 100].map((percent) => {
                const angle = (percent / 100) * 360 - 90; // Start from top
                const x1 = centerPoint + (radius - 8) * Math.cos(angle * Math.PI / 180);
                const y1 = centerPoint + (radius - 8) * Math.sin(angle * Math.PI / 180);
                const x2 = centerPoint + (radius + 6) * Math.cos(angle * Math.PI / 180);
                const y2 = centerPoint + (radius + 6) * Math.sin(angle * Math.PI / 180);
                const textX = centerPoint + (radius + 18) * Math.cos(angle * Math.PI / 180);
                const textY = centerPoint + (radius + 18) * Math.sin(angle * Math.PI / 180);
                
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
              
              {/* Complete circles (for each 100% increment) */}
              {Array.from({ length: completeCircles }, (_, i) => (
                <circle
                  key={`complete-${i}`}
                  cx={centerPoint}
                  cy={centerPoint}
                  r={radius}
                  fill="none"
                  stroke="#8b5cf6"
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeOpacity={Math.max(0.3, 1 - i * 0.15)} // Fade each layer
                  className="transition-all duration-700 ease-out"
                  style={{
                    filter: 'drop-shadow(0 4px 8px rgba(139, 92, 246, 0.3))'
                  }}
                />
              ))}
              
              {/* Partial circle for remainder percentage */}
              {remainderPercent > 0 && (
                <circle
                  cx={centerPoint}
                  cy={centerPoint}
                  r={radius}
                  fill="none"
                  stroke="#8b5cf6"
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={remainderOffset}
                  className="transition-all duration-700 ease-out"
                  transform={`rotate(-90 ${centerPoint} ${centerPoint})`}
                  style={{
                    filter: 'drop-shadow(0 4px 8px rgba(139, 92, 246, 0.3))'
                  }}
                />
              )}
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