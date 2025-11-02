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
  const actualUtilizationRate = utilizationRate || 150;
  
  // Modern color system with gradients - using purple/blue/magenta theme
  const getUtilizationConfig = (rate: number) => {
    if (rate <= 70) {
      return {
        status: 'Under-utilized',
        primaryColor: '#6B7280',
        secondaryColor: '#9CA3AF',
        bgColor: 'hsl(var(--muted))',
        textColor: 'hsl(var(--muted-foreground))'
      };
    } else if (rate <= 100) {
      return {
        status: 'Optimal',
        primaryColor: '#8B5CF6',
        secondaryColor: '#A78BFA',
        bgColor: 'hsl(var(--muted))',
        textColor: 'hsl(var(--foreground))'
      };
    } else {
      return {
        status: 'Over Capacity',
        primaryColor: '#EC4899',
        secondaryColor: '#F472B6',
        bgColor: 'hsl(var(--muted))',
        textColor: 'hsl(var(--destructive))'
      };
    }
  };
  
  const config = getUtilizationConfig(actualUtilizationRate);
  
  // Apple Watch style configuration
  const center = 110;
  const radius = 85;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  
  // Calculate progress with Apple Watch style logic
  const normalizedProgress = Math.min(actualUtilizationRate / 100, 1);
  
  // For over 100%, we'll show overflow in the same ring
  const isOverCapacity = actualUtilizationRate > 100;

  return (
    <Card className="rounded-2xl bg-white border border-border shadow-sm hover:shadow-md transition-shadow h-full">
      <CardContent className="p-6 h-full flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-brand-violet/10">
            <TrendingUp className="h-5 w-5 text-brand-violet" />
          </div>
          <span className="text-lg font-semibold text-brand-violet">Team Utilization</span>
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center relative p-6">
          {/* Apple Watch Style Single Ring */}
          <div className="relative flex items-center justify-center w-full h-full">
            <svg 
              width="220" 
              height="220" 
              viewBox="0 0 220 220" 
              className="w-full h-full max-w-[220px] max-h-[220px]"
            >
              {/* Apple Watch style gradient definitions */}
              <defs>
                <linearGradient id="normalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={config.primaryColor} />
                  <stop offset="100%" stopColor={config.secondaryColor} />
                </linearGradient>
                <linearGradient id="overflowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#EC4899" />
                  <stop offset="100%" stopColor="#F472B6" />
                </linearGradient>
              </defs>
              
              {/* Background track */}
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke="hsl(var(--muted))"
                strokeWidth={strokeWidth}
                opacity="0.1"
              />
              
              {/* Main progress ring (0-100%) */}
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke="url(#normalGradient)"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - Math.min(normalizedProgress, 1))}
                transform={`rotate(-90 ${center} ${center})`}
                className="transition-all duration-1000 ease-out"
                style={{
                  filter: "drop-shadow(0 0 8px rgba(0,0,0,0.1))"
                }}
              />
              
              {/* Overflow ring (100%+ on same track) */}
              {isOverCapacity && (
                <circle
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="none"
                  stroke="url(#overflowGradient)"
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference * (1 - Math.min((actualUtilizationRate - 100) / 100, 1))}
                  transform={`rotate(-90 ${center} ${center})`}
                  className="transition-all duration-1000 ease-out"
                  style={{
                    filter: "drop-shadow(0 0 12px rgba(255, 68, 68, 0.3))"
                  }}
                />
              )}
            </svg>
            
            {/* Center content - positioned to avoid ring overlap */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center w-32 h-32">
              <div className="text-4xl font-bold bg-gradient-to-br from-gray-900 to-gray-600 bg-clip-text text-transparent text-center">
                {Math.round(actualUtilizationRate)}%
              </div>
              <div 
                className="text-xs font-semibold mt-1 px-2 py-0.5 rounded-full bg-white/80 backdrop-blur-sm border text-center"
                style={{ color: config.textColor }}
              >
                {config.status}
              </div>
            </div>
          </div>

          {/* Modern status legend */}
          <div className="flex justify-center mt-4">
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs bg-card/60 backdrop-blur-sm rounded-full px-3 py-1.5 border border-border max-w-full">
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                <div className="w-2 h-2 rounded-full bg-gray-400 flex-shrink-0" />
                <span className="text-muted-foreground font-medium text-[10px]">Under</span>
              </div>
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                <div className="w-2 h-2 rounded-full bg-purple-500 flex-shrink-0" />
                <span className="text-muted-foreground font-medium text-[10px]">Optimal</span>
              </div>
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                <div className="w-2 h-2 rounded-full bg-pink-500 flex-shrink-0" />
                <span className="text-muted-foreground font-medium text-[10px]">Over</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center pt-2">
          <Badge variant="outline" className="text-xs bg-card text-muted-foreground border-border shadow-sm">
            This Month
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};