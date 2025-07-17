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
  const isOverCapacity = actualUtilizationRate > 100;
  
  // Calculate semicircle progress (180 degrees max)
  const normalizedRate = Math.min(actualUtilizationRate, 200) / 200; // Cap at 200% for display
  const angle = normalizedRate * 180; // 0 to 180 degrees
  const radius = 60;
  const strokeWidth = 8;
  const circumference = Math.PI * radius; // Half circle circumference
  const strokeDashoffset = circumference - (angle / 180) * circumference;

  return (
    <Card className="rounded-2xl bg-card-gradient-1 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-gray-600" />
            <span className="text-xs font-semibold text-gray-700 tracking-wide">TEAM UTILIZATION</span>
          </div>
        </div>
        
        <div className="flex flex-col justify-between h-full">
          {/* Semicircle Gauge */}
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="relative">
              <svg width="140" height="80" viewBox="0 0 140 80">
                {/* Background semicircle */}
                <path
                  d={`M 20 70 A ${radius} ${radius} 0 0 1 120 70`}
                  fill="none"
                  stroke="rgb(229, 231, 235)"
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                />
                {/* Progress semicircle */}
                <path
                  d={`M 20 70 A ${radius} ${radius} 0 0 1 120 70`}
                  fill="none"
                  stroke={isOverCapacity ? "rgb(239, 68, 68)" : "rgb(59, 130, 246)"}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-700 ease-out"
                />
              </svg>
            </div>
            {/* Percentage text below the gauge */}
            <div className="text-center mt-2">
              <div className="text-3xl font-bold text-gray-900">{Math.round(actualUtilizationRate)}%</div>
            </div>
          </div>
          
          {/* Status Badge */}
          <div className="flex justify-center mb-2">
            <Badge className={`text-xs ${isOverCapacity ? 'bg-red-100 text-red-700 border-red-200' : 'bg-green-100 text-green-700 border-green-200'}`}>
              {finalStatus}
            </Badge>
          </div>
          
          <div className="text-center">
            <span className="text-xs text-gray-500">This Month</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};