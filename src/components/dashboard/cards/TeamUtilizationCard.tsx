import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { StandardizedBadge } from "@/components/ui/standardized-badge";
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
        message: 'Below capacity'
      };
    } else if (rate <= 100) {
      return { 
        status: 'Optimal', 
        color: 'hsl(142 76% 36%)',
        gradient: 'from-green-400 to-emerald-500',
        bgGradient: 'from-green-50 to-emerald-50',
        icon: Activity,
        message: 'Perfect balance'
      };
    } else {
      return { 
        status: 'Over Capacity', 
        color: 'hsl(346 77% 49%)',
        gradient: 'from-purple-500 via-pink-500 to-red-500',
        bgGradient: 'from-purple-50 via-pink-50 to-red-50',
        icon: TrendingUp,
        message: 'Exceeding limit'
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
      
      <CardContent className="relative p-4 sm:p-6 lg:p-8 h-full flex flex-col">
        {/* Header - Responsive */}
        <div className="flex items-start sm:items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className={`flex-shrink-0 p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-br ${config.gradient} shadow-lg`}>
            <Users className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm sm:text-base lg:text-lg font-bold text-foreground truncate">Team Utilization</h3>
            <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{config.message}</p>
          </div>
        </div>
        
        {/* Circular Progress Gauge - Fully Responsive */}
        <div className="flex-1 flex items-center justify-center py-2 sm:py-4">
          <div className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64">
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
            
            {/* Center content - Responsive sizing */}
            <div className="absolute inset-0 flex flex-col items-center justify-center px-2">
              <div className={`mb-1 sm:mb-2 p-1.5 sm:p-2 lg:p-3 rounded-full bg-gradient-to-br ${config.gradient} shadow-lg animate-pulse flex-shrink-0`}>
                <StatusIcon className="h-3 w-3 sm:h-4 sm:w-4 lg:h-6 lg:w-6 text-white" />
              </div>
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-br bg-clip-text text-transparent leading-none" style={{
                backgroundImage: `linear-gradient(135deg, ${config.color}, ${config.color})`
              }}>
                {Math.round(actualUtilizationRate)}%
              </div>
              <div className="mt-1 sm:mt-2 text-[10px] sm:text-xs lg:text-sm font-semibold text-muted-foreground text-center">
                Utilization Rate
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer metrics - Responsive grid */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4 mt-4 sm:mt-6">
          <div className="flex flex-col items-center p-2 sm:p-3 lg:p-4 rounded-xl sm:rounded-2xl bg-white/60 backdrop-blur-sm border border-white/40 shadow-sm">
            <StandardizedBadge 
              variant={actualUtilizationRate <= 70 ? "secondary" : actualUtilizationRate <= 100 ? "success" : "error"} 
              size="sm" 
              className="mb-1 sm:mb-2"
            >
              {config.status}
            </StandardizedBadge>
            <span className="text-[10px] sm:text-xs text-muted-foreground text-center">Status</span>
          </div>
          
          <div className="flex flex-col items-center p-2 sm:p-3 lg:p-4 rounded-xl sm:rounded-2xl bg-white/60 backdrop-blur-sm border border-white/40 shadow-sm">
            <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
              <Activity className="h-3 w-3 sm:h-4 sm:w-4 text-theme-primary flex-shrink-0" />
              <span className="text-[10px] sm:text-xs lg:text-sm font-bold text-foreground whitespace-nowrap">This Month</span>
            </div>
            <span className="text-[10px] sm:text-xs text-muted-foreground text-center">Period</span>
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
