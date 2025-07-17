
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
  
  // Simplified 3-ring configuration with clearer distinctions
  const rings = [
    { 
      capacity: 75, 
      radius: 70, 
      color: '#10b981', 
      bgColor: '#dcfce7',
      label: 'Optimal'
    }, // Green - Optimal (0-75%)
    { 
      capacity: 100, 
      radius: 85, 
      color: '#8b5cf6', 
      bgColor: '#f3e8ff',
      label: 'At Capacity'
    }, // Purple - At capacity (75-100%)
    { 
      capacity: 150, 
      radius: 100, 
      color: '#6b46c1', 
      bgColor: '#ede9fe',
      label: 'Over Capacity'
    }, // Darker Purple - Over capacity (100%+)
  ];
  
  const strokeWidth = 14;
  const centerPoint = 120;
  const svgSize = 240;
  
  // Calculate which rings should be filled and how much
  const getRingFillData = () => {
    return rings.map((ring, index) => {
      const previousCapacity = index > 0 ? rings[index - 1].capacity : 0;
      const ringCapacityRange = ring.capacity - previousCapacity;
      
      let fillPercentage = 0;
      if (actualUtilizationRate > previousCapacity) {
        const excessUtilization = Math.min(actualUtilizationRate - previousCapacity, ringCapacityRange);
        fillPercentage = (excessUtilization / ringCapacityRange) * 100;
      }
      
      const circumference = 2 * Math.PI * ring.radius;
      const strokeDashoffset = circumference - (fillPercentage / 100 * circumference);
      
      return {
        ...ring,
        fillPercentage,
        circumference,
        strokeDashoffset,
        isActive: fillPercentage > 0,
      };
    });
  };
  
  const ringData = getRingFillData();

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
              {/* Multi-ring gauge */}
              {ringData.map((ring, index) => (
                <g key={index}>
                  {/* Background ring */}
                  <circle
                    cx={centerPoint}
                    cy={centerPoint}
                    r={ring.radius}
                    fill="none"
                    stroke={ring.bgColor}
                    strokeWidth={strokeWidth}
                  />
                  
                  {/* Progress ring */}
                  {ring.isActive && (
                    <circle
                      cx={centerPoint}
                      cy={centerPoint}
                      r={ring.radius}
                      fill="none"
                      stroke={ring.color}
                      strokeWidth={strokeWidth}
                      strokeLinecap="round"
                      strokeDasharray={ring.circumference}
                      strokeDashoffset={ring.strokeDashoffset}
                      transform={`rotate(-90 ${centerPoint} ${centerPoint})`}
                      className="transition-all duration-1000 ease-out"
                      style={{
                        filter: `drop-shadow(0 2px 6px ${ring.color}40)`,
                        animationDelay: `${index * 200}ms`
                      }}
                    />
                  )}
                </g>
              ))}
            </svg>
            
            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-4xl font-bold text-foreground mb-2">{Math.round(actualUtilizationRate)}%</div>
              <Badge className="text-xs bg-background/50 text-muted-foreground border-muted">
                {finalStatus}
              </Badge>
            </div>
          </div>

          {/* Simplified Legend */}
          <div className="flex justify-center gap-4 mt-4">
            {rings.map((ring, index) => (
              <div key={index} className="flex items-center gap-1">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: ring.color }}
                />
                <span className="text-xs text-gray-600">{ring.label}</span>
              </div>
            ))}
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
