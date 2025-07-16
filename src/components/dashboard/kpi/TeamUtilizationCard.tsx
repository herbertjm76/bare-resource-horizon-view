import React from 'react';
import { TrendingUp } from 'lucide-react';

interface TeamUtilizationCardProps {
  utilizationRate: number;
  status: {
    status: string;
    color: string;
    textColor: string;
  };
}

export const TeamUtilizationCard: React.FC<TeamUtilizationCardProps> = ({
  utilizationRate,
  status
}) => {
  const displayRate = Math.round(utilizationRate);
  const isOverCapacity = displayRate > 100;
  
  // Calculate stroke-dashoffset for circular progress
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(displayRate, 100) / 100) * circumference;

  return (
    <div className="glass-card p-6 rounded-xl border border-white/10">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-white/5">
          <TrendingUp className="h-5 w-5 text-muted-foreground" />
        </div>
        <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Team Utilization
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="relative w-20 h-20">
              <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-muted/20"
                />
                {/* Progress circle */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  stroke={isOverCapacity ? "#ef4444" : "#10b981"}
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-500 ease-in-out"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-lg font-bold ${isOverCapacity ? 'text-red-500' : 'text-emerald-500'}`}>
                  {displayRate}
                </span>
              </div>
            </div>
          </div>
          
          <div className="space-y-1">
            <div className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
              isOverCapacity 
                ? 'bg-red-500/10 text-red-500' 
                : 'bg-emerald-500/10 text-emerald-500'
            }`}>
              {isOverCapacity ? 'Critical' : 'Good'}
            </div>
            <div className="text-2xl font-bold text-foreground">
              {displayRate}%
            </div>
            <div className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
              isOverCapacity 
                ? 'bg-red-500/10 text-red-400' 
                : 'bg-emerald-500/10 text-emerald-400'
            }`}>
              {isOverCapacity ? 'Over Capacity' : 'Within Capacity'}
            </div>
            <div className="text-sm text-muted-foreground">
              This Month
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};