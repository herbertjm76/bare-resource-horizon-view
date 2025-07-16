import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from 'lucide-react';

interface TeamUtilizationCardProps {
  score?: number;
  status?: string;
}

export const TeamUtilizationCard: React.FC<TeamUtilizationCardProps> = ({
  score = 42,
  status = "Over Capacity"
}) => {
  // Calculate stroke dash array for circle progress
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <Card className="rounded-2xl glass-card glass-hover border-white/20">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-white/70" />
            <span className="text-xs font-semibold text-white/90 tracking-wide">TEAM UTILIZATION</span>
          </div>
        </div>
        
        <div className="flex flex-col items-center space-y-4">
          {/* Circular Progress */}
          <div className="relative w-24 h-24">
            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="8"
                fill="transparent"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke="#ef4444"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-300"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">{score}</span>
            </div>
          </div>
          
          <div className="text-center space-y-2">
            <p className="text-sm text-white/80">Here are some of the tricks to</p>
            <p className="text-sm text-white/80">improve your score</p>
            
            <div className="flex flex-col items-center gap-2 mt-4">
              <Badge className="text-xs bg-red-500/20 text-red-400 border-red-500/30">
                {status}
              </Badge>
              <span className="text-xs text-white/60">This Month</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};