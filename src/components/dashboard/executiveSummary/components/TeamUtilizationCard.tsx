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
  // Calculate circle progress
  const normalizedRate = Math.min(utilizationRate, 200); // Cap at 200% for visual purposes
  const circumference = 2 * Math.PI * 45; // radius of 45
  const strokeDashoffset = circumference - (normalizedRate / 200) * circumference;

  return (
    <Card className="rounded-2xl glass-card glass-hover border-white/20">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-semibold text-white/90 tracking-wide uppercase">Team Utilization</p>
          <TrendingUp className="h-4 w-4 text-white/60" />
        </div>
        
        <div className="flex items-center justify-center mb-4">
          <div className="relative w-24 h-24">
            <svg className="transform -rotate-90 w-24 h-24" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-white/20"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className={utilizationRate >= 150 ? "text-red-400" : 
                          utilizationRate >= 100 ? "text-orange-400" : 
                          "text-green-400"}
                style={{
                  transition: 'stroke-dashoffset 0.5s ease-in-out',
                }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-white">
                {Math.round(utilizationRate)}
              </span>
            </div>
          </div>
        </div>

        <div className="text-center space-y-2">
          <Badge className={`text-xs glass-card border-white/20 text-white/90 ${utilizationStatus.color}`}>
            {utilizationStatus.label}
          </Badge>
          <p className="text-3xl font-bold text-white tracking-tight">
            {Math.round(utilizationRate)}%
          </p>
          <p className="text-sm font-medium text-white/80">This Month</p>
        </div>
      </CardContent>
    </Card>
  );
};