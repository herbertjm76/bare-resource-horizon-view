import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Activity, Users } from 'lucide-react';

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
  const actualUtilizationRate = utilizationRate || 150;
  
  const getUtilizationConfig = (rate: number) => {
    if (rate <= 70) {
      return { 
        status: 'Under-utilized', 
        color: 'hsl(var(--muted-foreground))',
        gradient: 'from-gray-400 to-gray-500',
        bgGradient: 'from-gray-50 to-gray-100',
        icon: TrendingDown,
        message: 'Below optimal capacity'
      };
    } else if (rate <= 100) {
      return { 
        status: 'Optimal', 
        color: 'hsl(142 76% 36%)',
        gradient: 'from-green-400 to-emerald-500',
        bgGradient: 'from-green-50 to-emerald-50',
        icon: Activity,
        message: 'Perfect utilization'
      };
    } else {
      return { 
        status: 'Over Capacity', 
        color: 'hsl(346 77% 49%)',
        gradient: 'from-purple-500 via-pink-500 to-red-500',
        bgGradient: 'from-purple-50 via-pink-50 to-red-50',
        icon: TrendingUp,
        message: 'Exceeding capacity'
      };
    }
  };
  
  const config = getUtilizationConfig(actualUtilizationRate);
  const StatusIcon = config.icon;
  
  // Calculate stroke dash for circular progress
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(actualUtilizationRate, 200);
  const strokeDashoffset = circumference - (progress / 200) * circumference;

  return (
    <Card className={`group relative rounded-3xl border-0 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden h-full bg-gradient-to-br ${config.bgGradient}`}>
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <CardContent className="relative p-8 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl bg-gradient-to-br ${config.gradient} shadow-lg`}>
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Team Utilization</h3>
              <p className="text-xs text-muted-foreground">{config.message}</p>
            </div>
          </div>
        </div>
        
        {/* Circular Progress Gauge */}
        <div className="flex-1 flex items-center justify-center py-4">
          <div className="relative w-64 h-64">
            {/* SVG Circle */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
              {/* Background circle */}
              <circle
                cx="100"
                cy="100"
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth="12"
                className="text-muted/20"
              />
              
              {/* Gradient definition */}
              <defs>
                <linearGradient id="utilization-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={actualUtilizationRate <= 70 ? '#9ca3af' : actualUtilizationRate <= 100 ? '#10b981' : '#a855f7'} />
                  <stop offset="50%" stopColor={actualUtilizationRate <= 70 ? '#6b7280' : actualUtilizationRate <= 100 ? '#059669' : '#ec4899'} />
                  <stop offset="100%" stopColor={actualUtilizationRate <= 70 ? '#4b5563' : actualUtilizationRate <= 100 ? '#047857' : '#ef4444'} />
                </linearGradient>
                
                {/* Glow filter */}
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {/* Progress circle */}
              <circle
                cx="100"
                cy="100"
                r={radius}
                fill="none"
                stroke="url(#utilization-gradient)"
                strokeWidth="14"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000 ease-out drop-shadow-2xl"
                filter="url(#glow)"
                style={{
                  animation: 'dash 2s ease-in-out'
                }}
              />
            </svg>
            
            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className={`mb-2 p-3 rounded-full bg-gradient-to-br ${config.gradient} shadow-lg animate-pulse`}>
                <StatusIcon className="h-6 w-6 text-white" />
              </div>
              <div className="text-5xl font-bold bg-gradient-to-br bg-clip-text text-transparent" style={{
                backgroundImage: `linear-gradient(135deg, ${config.color}, ${config.color})`
              }}>
                {Math.round(actualUtilizationRate)}%
              </div>
              <div className="mt-2 text-sm font-semibold text-muted-foreground">
                Utilization Rate
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer metrics */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="flex flex-col items-center p-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/40 shadow-sm">
            <Badge className={`mb-2 text-xs font-bold border-0 bg-gradient-to-r ${config.gradient} text-white shadow-lg`}>
              {config.status}
            </Badge>
            <span className="text-xs text-muted-foreground">Current Status</span>
          </div>
          
          <div className="flex flex-col items-center p-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/40 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-4 w-4 text-brand-violet" />
              <span className="text-sm font-bold text-foreground">This Month</span>
            </div>
            <span className="text-xs text-muted-foreground">Time Period</span>
          </div>
        </div>
      </CardContent>
      
      <style>{`
        @keyframes dash {
          from {
            stroke-dashoffset: ${circumference};
          }
          to {
            stroke-dashoffset: ${strokeDashoffset};
          }
        }
      `}</style>
    </Card>
  );
};
