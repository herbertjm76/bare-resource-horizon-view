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
        primaryColor: '#EF4444',
        secondaryColor: '#F87171',
        bgColor: 'hsl(var(--muted))',
        textColor: 'hsl(var(--destructive))'
      };
    }
  };
  
  const config = getUtilizationConfig(actualUtilizationRate);
  
  // Circle configuration for clean design
  const centerX = 100;
  const centerY = 100;
  const baseRadius = 70;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * baseRadius;
  
  // Base progress (0-100%)
  const baseProgress = Math.min(actualUtilizationRate, 100) / 100;
  const baseDashOffset = circumference * (1 - baseProgress);
  
  // Overflow segments for clean layered look
  const overflowSegments = [];
  if (actualUtilizationRate > 100) {
    const overflowAmount = actualUtilizationRate - 100;
    const numberOfSegments = Math.min(Math.ceil(overflowAmount / 25), 4);
    
    for (let i = 0; i < numberOfSegments; i++) {
      const segmentRadius = baseRadius + (i + 1) * 6;
      const segmentCircumference = 2 * Math.PI * segmentRadius;
      const segmentProgress = Math.min(overflowAmount - (i * 25), 25) / 25;
      const segmentLength = segmentCircumference * segmentProgress * 0.75; // 75% max arc length
      
      overflowSegments.push({
        radius: segmentRadius,
        progress: segmentProgress,
        dashArray: `${segmentLength} ${segmentCircumference}`,
        dashOffset: segmentCircumference * 0.25, // Start from top
        opacity: 0.8 - (i * 0.15),
        strokeWidth: strokeWidth - (i * 1),
        delay: i * 0.2
      });
    }
  }

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
          {/* Modern Circular Progress */}
          <div className="relative flex items-center justify-center w-full h-full">
            <svg 
              width="220" 
              height="220" 
              viewBox="0 0 220 220" 
              className="w-full h-full max-w-[220px] max-h-[220px] drop-shadow-sm"
            >
              {/* Gradient Definitions */}
              <defs>
                <linearGradient id="baseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={config.primaryColor} />
                  <stop offset="100%" stopColor={config.secondaryColor} />
                </linearGradient>
                <linearGradient id="overflowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#EF4444" />
                  <stop offset="50%" stopColor="#F87171" />
                  <stop offset="100%" stopColor="#FCA5A5" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {/* Background track */}
              <circle
                cx="110"
                cy="110"
                r={baseRadius}
                fill="none"
                stroke={config.bgColor}
                strokeWidth={strokeWidth}
                opacity="0.2"
              />
              
              {/* Main progress arc */}
              <circle
                cx="110"
                cy="110"
                r={baseRadius}
                fill="none"
                stroke="url(#baseGradient)"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={baseDashOffset}
                transform="rotate(-90 110 110)"
                className="transition-all duration-1000 ease-out"
                style={{
                  filter: "url(#glow)",
                }}
              />
              
              {/* Overflow segments with clean layering */}
              {isOverCapacity && overflowSegments.map((segment, index) => (
                <circle
                  key={index}
                  cx="110"
                  cy="110"
                  r={segment.radius}
                  fill="none"
                  stroke="url(#overflowGradient)"
                  strokeWidth={segment.strokeWidth}
                  strokeLinecap="round"
                  strokeDasharray={segment.dashArray}
                  strokeDashoffset={segment.dashOffset}
                  transform="rotate(-90 110 110)"
                  opacity={segment.opacity}
                  className="transition-all duration-1000 ease-out"
                  style={{
                    filter: "url(#glow)",
                    animation: `pulse ${3 + segment.delay}s ease-in-out infinite`
                  }}
                />
              ))}
              
              {/* Modern indicator dots */}
              {isOverCapacity && overflowSegments.map((segment, index) => (
                segment.progress > 0.2 && (
                  <circle
                    key={`dot-${index}`}
                    cx={110 + segment.radius * Math.cos(-Math.PI/2 + segment.progress * Math.PI * 1.5)}
                    cy={110 + segment.radius * Math.sin(-Math.PI/2 + segment.progress * Math.PI * 1.5)}
                    r="2.5"
                    fill="#EF4444"
                    className="transition-all duration-1000 ease-out"
                    style={{
                      filter: "drop-shadow(0 0 4px #EF4444)",
                      animation: `pulse ${2 + index * 0.3}s ease-in-out infinite`
                    }}
                  />
                )
              ))}
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
