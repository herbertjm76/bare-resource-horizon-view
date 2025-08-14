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
  const actualUtilizationRate = utilizationRate || 75;
  
  // Define utilization thresholds and colors
  const getUtilizationConfig = (rate: number) => {
    if (rate <= 70) {
      return {
        status: 'Under-utilized',
        color: '#6b7280', // gray
        bgColor: '#f3f4f6',
        progress: rate,
        maxProgress: 70
      };
    } else if (rate <= 100) {
      return {
        status: 'Optimal',
        color: '#10b981', // green
        bgColor: '#dcfce7',
        progress: rate,
        maxProgress: 100
      };
    } else {
      return {
        status: 'Over Capacity',
        color: '#ef4444', // red
        bgColor: '#fee2e2',
        progress: Math.min(rate, 150), // Cap visual at 150%
        maxProgress: 150
      };
    }
  };
  
  const config = getUtilizationConfig(actualUtilizationRate);
  
  // Calculate circle properties
  const radius = 80;
  const overflowRadius = 85;
  const circumference = 2 * Math.PI * radius;
  const overflowCircumference = 2 * Math.PI * overflowRadius;
  const strokeWidth = 12;
  
  // Base ring calculations (0-100%)
  const baseProgress = Math.min(actualUtilizationRate, 100);
  const baseStrokeDasharray = circumference;
  const baseStrokeDashoffset = circumference - (baseProgress / 100) * circumference;
  
  // Overflow ring calculations (100%+)
  const isOverCapacity = actualUtilizationRate > 100;
  const overflowProgress = isOverCapacity ? ((actualUtilizationRate - 100) / 50) * 100 : 0; // Scale to show up to 150% (50% overflow)
  const overflowStrokeDasharray = `${overflowCircumference * 0.02} ${overflowCircumference * 0.01}`; // Dashed pattern
  const overflowStrokeDashoffset = overflowCircumference - (Math.min(overflowProgress, 100) / 100) * overflowCircumference;

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
          {/* Multi-Lap Ring Gauge */}
          <div className="relative flex items-center justify-center w-full h-full">
            <svg 
              width="200" 
              height="200" 
              viewBox="0 0 200 200" 
              className="w-full h-full max-w-[200px] max-h-[200px]"
            >
              {/* Background circle */}
              <circle
                cx="100"
                cy="100"
                r={radius}
                fill="none"
                stroke={config.bgColor}
                strokeWidth={strokeWidth}
              />
              
              {/* Base progress circle (0-100%) */}
              <circle
                cx="100"
                cy="100"
                r={radius}
                fill="none"
                stroke={config.color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={baseStrokeDasharray}
                strokeDashoffset={baseStrokeDashoffset}
                transform="rotate(-90 100 100)"
                className="transition-all duration-1000 ease-out"
                style={{
                  filter: `drop-shadow(0 2px 6px ${config.color}40)`
                }}
              />
              
              {/* Overflow ring (100%+) - only show when over capacity */}
              {isOverCapacity && (
                <circle
                  cx="100"
                  cy="100"
                  r={overflowRadius}
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth={8}
                  strokeLinecap="round"
                  strokeDasharray={overflowStrokeDasharray}
                  strokeDashoffset={overflowStrokeDashoffset}
                  transform="rotate(-90 100 100)"
                  className="transition-all duration-1000 ease-out animate-pulse"
                  style={{
                    filter: 'drop-shadow(0 2px 8px #ef444480)',
                    opacity: 0.9
                  }}
                />
              )}
            </svg>
            
            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-4xl font-bold text-foreground">{Math.round(actualUtilizationRate)}%</div>
              <div className="text-sm font-medium mt-1" style={{ color: config.color }}>
                {config.status}
              </div>
            </div>
          </div>

          {/* Status indicator */}
          <div className="flex justify-center mt-4">
            <div className="flex items-center gap-6 text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-gray-400" />
                <span>Under (≤70%)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span>Optimal (70-100%)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span>Over (&gt;100%)</span>
              </div>
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
