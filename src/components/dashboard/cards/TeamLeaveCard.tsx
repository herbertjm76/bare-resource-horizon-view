import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from 'lucide-react';

interface TeamLeaveCardProps {
  data: any;
  selectedTimeRange: any;
}

export const TeamLeaveCard: React.FC<TeamLeaveCardProps> = ({
  data,
  selectedTimeRange
}) => {
  // Mock leave trend data - replace with actual data from props
  const leaveData = [
    { day: 'Sun', value: 2 },
    { day: 'Mon', value: 4 },
    { day: 'Tue', value: 3 },
    { day: 'Wed', value: 6 },
    { day: 'Thu', value: 5 },
    { day: 'Fri', value: 7 },
    { day: 'Sat', value: 4 }
  ];

  const maxValue = Math.max(...leaveData.map(d => d.value));
  
  // Generate SVG path for the line chart
  const generatePath = () => {
    const width = 280;
    const height = 80;
    const padding = 20;
    
    let path = '';
    leaveData.forEach((point, index) => {
      const x = padding + (index * (width - 2 * padding)) / (leaveData.length - 1);
      const y = height - padding - ((point.value / maxValue) * (height - 2 * padding));
      
      if (index === 0) {
        path += `M ${x} ${y}`;
      } else {
        path += ` L ${x} ${y}`;
      }
    });
    
    return path;
  };

  return (
    <Card className="rounded-2xl glass-card glass-hover border-white/20 h-full">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-white/80" />
            <h3 className="text-sm font-semibold text-white/90 tracking-wide uppercase">
              TEAM LEAVE
            </h3>
          </div>
        </div>
        
        <div className="space-y-4">
          {/* Line chart */}
          <div className="relative">
            <svg width="280" height="80" className="overflow-visible">
              {/* Grid lines */}
              {[0, 1, 2, 3, 4].map((i) => (
                <line
                  key={i}
                  x1="20"
                  y1={20 + (i * 10)}
                  x2="260"
                  y2={20 + (i * 10)}
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth="1"
                />
              ))}
              
              {/* Line chart */}
              <path
                d={generatePath()}
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="2"
                className="drop-shadow-sm"
              />
              
              {/* Data points */}
              {leaveData.map((point, index) => {
                const x = 20 + (index * 220) / (leaveData.length - 1);
                const y = 60 - ((point.value / maxValue) * 40);
                return (
                  <circle
                    key={index}
                    cx={x}
                    cy={y}
                    r="3"
                    fill="#8b5cf6"
                    className="drop-shadow-sm"
                  />
                );
              })}
            </svg>
          </div>
          
          {/* Day labels */}
          <div className="flex justify-between text-xs text-white/60 px-4">
            {leaveData.map((point) => (
              <span key={point.day}>{point.day}</span>
            ))}
          </div>
          
          <p className="text-xs text-white/60 text-center">This Month</p>
        </div>
      </CardContent>
    </Card>
  );
};