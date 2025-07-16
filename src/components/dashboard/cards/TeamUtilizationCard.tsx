import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp } from 'lucide-react';

interface TeamUtilizationCardProps {
  data: any;
  selectedTimeRange: any;
}

export const TeamUtilizationCard: React.FC<TeamUtilizationCardProps> = ({
  data,
  selectedTimeRange
}) => {
  // Calculate utilization percentage from data
  const utilizationRate = data?.teamMetrics?.utilizationRate || 42;
  const isOverCapacity = utilizationRate > 80;
  
  // Calculate circumference for stroke-dasharray
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (utilizationRate / 100) * circumference;

  return (
    <Card className="rounded-2xl glass-card glass-hover border-white/20 h-full">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-white/80" />
            <h3 className="text-sm font-semibold text-white/90 tracking-wide uppercase">
              TEAM UTILIZATION
            </h3>
          </div>
        </div>
        
        <div className="flex flex-col items-center justify-center space-y-4">
          {/* Donut Chart */}
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="8"
                fill="transparent"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke={isOverCapacity ? "#ef4444" : "#22c55e"}
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            {/* Center text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold text-white">
                {Math.round(utilizationRate)}
              </span>
            </div>
          </div>
          
          {/* Status indicators */}
          <div className="space-y-2 text-center">
            {isOverCapacity && (
              <div className="text-sm font-medium text-red-300 bg-red-500/20 px-3 py-1 rounded-full">
                Over Capacity
              </div>
            )}
            <p className="text-sm text-white/70">
              Here are some of the tricks to improve your score
            </p>
            <p className="text-xs text-white/60">This Month</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};