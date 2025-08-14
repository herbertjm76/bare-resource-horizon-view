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
  
  // Modern color system with gradients
  const getUtilizationConfig = (rate: number) => {
    if (rate <= 70) {
      return {
        status: 'Under-utilized',
        primaryColor: '#8B5CF6',
        secondaryColor: '#A78BFA',
        bgColor: 'hsl(var(--muted))',
        textColor: 'hsl(var(--muted-foreground))'
      };
    } else if (rate <= 100) {
      return {
        status: 'Optimal',
        primaryColor: '#10B981',
        secondaryColor: '#34D399',
        bgColor: 'hsl(var(--muted))',
        textColor: 'hsl(var(--foreground))'
      };
    } else {
      return {
        status: 'Over Capacity',
        primaryColor: '#10B981',
        secondaryColor: '#34D399',
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
    <Card className="rounded-2xl bg-gradient-to-br from-white via-gray-50/50 to-white border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 h-full backdrop-blur-sm">
      <CardContent className="p-0 h-full flex flex-col">
        <div className="flex items-center justify-between p-6 pb-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </div>
            <span className="text-sm font-semibold text-gray-700 tracking-wide">Team Utilization</span>
          </div>
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
                  <stop offset="0%" stopColor="#FF4444" />
                  <stop offset="100%" stopColor="#FF6B6B" />
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
            
            {/* Center content with better typography */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-5xl font-bold bg-gradient-to-br from-gray-900 to-gray-600 bg-clip-text text-transparent">
                {Math.round(actualUtilizationRate)}%
              </div>
              <div 
                className="text-sm font-semibold mt-2 px-3 py-1 rounded-full bg-white/80 backdrop-blur-sm border"
                style={{ color: config.textColor }}
              >
                {config.status}
              </div>
            </div>
          </div>

          {/* Modern status legend */}
          <div className="flex justify-center mt-6">
            <div className="flex items-center gap-6 text-xs bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-purple-400 to-purple-500" />
                <span className="text-gray-600 font-medium">Under</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-green-400 to-green-500" />
                <span className="text-gray-600 font-medium">Optimal</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-red-400 to-red-500" />
                <span className="text-gray-600 font-medium">Over</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center p-6 pt-0">
          <Badge variant="outline" className="text-xs bg-gradient-to-r from-gray-50 to-white text-gray-600 border-gray-200 shadow-sm">
            This Month
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};