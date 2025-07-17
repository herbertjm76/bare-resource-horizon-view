import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from 'lucide-react';

interface TeamLeaveCardProps {
  leaveData?: number[];
  teamMembers?: any[];
}

interface TeamLeaveCardProps {
  leaveData?: number[];
  teamMembers?: any[];
  memberUtilizations?: any[];
}

export const TeamLeaveCard: React.FC<TeamLeaveCardProps> = ({
  leaveData,
  teamMembers = [],
  memberUtilizations = []
}) => {
  // Generate leave data based on real data if available
  const generateLeaveData = () => {
    const teamSize = teamMembers.length || 5;
    
    // Calculate total leave from real data
    const totalAnnualLeave = memberUtilizations.reduce((total, member) => total + (member.annualLeave || 0), 0);
    const totalOtherLeave = memberUtilizations.reduce((total, member) => total + (member.otherLeave || 0), 0);
    const totalLeave = totalAnnualLeave + totalOtherLeave;
    
    // Use real data if available, otherwise use mock data
    const baseLeave = totalLeave > 0 ? totalLeave / 7 : teamSize * 3;
    
    return Array.from({ length: 7 }, (_, index) => {
      // Create more realistic patterns with higher variations
      const dayMultiplier = index === 0 || index === 6 ? 0.2 : 1.5; // Lower weekend usage
      const variation = Math.random() * 1.2 + 0.4; // 40-160% variation
      return Math.round(baseLeave * dayMultiplier * variation);
    });
  };
  
  const data = leaveData || generateLeaveData();
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const maxValue = Math.max(...data, 10); // Ensure minimum scale
  const minValue = Math.min(...data);

  return (
    <Card className="rounded-2xl bg-card-gradient-3 border border-gray-200 shadow-sm hover:shadow-md transition-shadow h-full">
      <CardContent className="p-4 h-full flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-4 w-4 text-gray-600" />
          <span className="text-xs font-medium text-gray-700 tracking-wider">TEAM LEAVE</span>
        </div>
        
        <div className="flex-1 flex flex-col min-h-0">
          {/* Chart area - taking full remaining height */}
          <div className="relative flex-1 min-h-[120px] bg-gradient-to-br from-blue-50/30 to-purple-50/30 rounded-xl border border-gray-100/50 overflow-hidden">
            {/* Background grid pattern */}
            <div className="absolute inset-0 opacity-30">
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 280 160">
                <defs>
                  <pattern id="grid" width="40" height="32" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 32" fill="none" stroke="rgba(139, 92, 246, 0.4)" strokeWidth="0.5"/>
                  </pattern>
                  <pattern id="colorGrid" width="40" height="32" patternUnits="userSpaceOnUse">
                    <rect width="40" height="32" fill="rgba(99, 102, 241, 0.08)"/>
                    <path d="M 40 0 L 0 0 0 32" fill="none" stroke="rgba(139, 92, 246, 0.3)" strokeWidth="0.8"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#colorGrid)" />
              </svg>
            </div>

            <svg className="w-full h-full relative z-10" preserveAspectRatio="none" viewBox="0 0 280 160">
              {/* Define gradients */}
              <defs>
                <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(99, 102, 241, 0.6)" stopOpacity="1"/>
                  <stop offset="50%" stopColor="rgba(139, 92, 246, 0.4)" stopOpacity="1"/>
                  <stop offset="100%" stopColor="rgba(139, 92, 246, 0.1)" stopOpacity="0"/>
                </linearGradient>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgb(99, 102, 241)"/>
                  <stop offset="100%" stopColor="rgb(139, 92, 246)"/>
                </linearGradient>
              </defs>
              
              {/* Horizontal grid lines */}
              {[0, 1, 2, 3, 4].map((line) => (
                <line
                  key={line}
                  x1="0"
                  y1={line * 32}
                  x2="280"
                  y2={line * 32}
                  stroke="rgba(139, 92, 246, 0.25)"
                  strokeWidth="1"
                  strokeDasharray="3,2"
                />
              ))}
              
              {/* Vertical grid lines for each day */}
              {days.map((_, index) => (
                <line
                  key={index}
                  x1={(index * 280) / (days.length - 1)}
                  y1="0"
                  x2={(index * 280) / (days.length - 1)}
                  y2="160"
                  stroke="rgba(99, 102, 241, 0.25)"
                  strokeWidth="1"
                  strokeDasharray="3,2"
                />
              ))}
              
              {/* Area fill */}
              <path
                d={`M 0 160 ${data.map((value, index) => {
                  const x = (index * 280) / (data.length - 1);
                  const y = 160 - ((value - minValue) / (maxValue - minValue)) * 130;
                  return `L ${x} ${y}`;
                }).join(' ')} L 280 160 Z`}
                fill="url(#areaGradient)"
                className="transition-all duration-500"
              />
              
              {/* Line chart */}
              <polyline
                fill="none"
                stroke="url(#lineGradient)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={data.map((value, index) => {
                  const x = (index * 280) / (data.length - 1);
                  const y = 160 - ((value - minValue) / (maxValue - minValue)) * 130;
                  return `${x},${y}`;
                }).join(' ')}
                className="drop-shadow-sm"
              />
              
              {/* Data points with glow effect */}
              {data.map((value, index) => {
                const x = (index * 280) / (data.length - 1);
                const y = 160 - ((value - minValue) / (maxValue - minValue)) * 130;
                return (
                  <g key={index}>
                    {/* Glow effect */}
                    <circle
                      cx={x}
                      cy={y}
                      r="6"
                      fill="rgba(139, 92, 246, 0.3)"
                      className="animate-pulse"
                    />
                    {/* Main point */}
                    <circle
                      cx={x}
                      cy={y}
                      r="3"
                      fill="rgb(139, 92, 246)"
                      stroke="white"
                      strokeWidth="2"
                      className="drop-shadow-md"
                    />
                  </g>
                );
              })}
              
              {/* Value labels on hover areas */}
              {data.map((value, index) => {
                const x = (index * 280) / (data.length - 1);
                const y = 160 - ((value - minValue) / (maxValue - minValue)) * 130;
                return (
                  <text
                    key={`label-${index}`}
                    x={x}
                    y={y - 15}
                    textAnchor="middle"
                    className="text-xs font-medium fill-gray-700"
                    opacity="0.8"
                  >
                    {value}
                  </text>
                );
              })}
            </svg>
          </div>
          
          {/* Day labels with enhanced styling */}
          <div className="grid grid-cols-7 gap-1 mt-3 px-2">
            {days.map((day, index) => (
              <div key={day} className="text-center">
                <span className={`text-xs font-medium ${
                  index === 0 || index === 6 
                    ? 'text-gray-400' 
                    : 'text-gray-600'
                } tracking-wide`}>
                  {day}
                </span>
                <div className={`h-1 w-full mt-1 rounded-full ${
                  data[index] > (maxValue * 0.7) 
                    ? 'bg-red-200' 
                    : data[index] > (maxValue * 0.4) 
                    ? 'bg-yellow-200' 
                    : 'bg-green-200'
                }`} />
              </div>
            ))}
          </div>
          
          <div className="flex justify-center mt-3">
            <Badge variant="outline" className="text-xs bg-gradient-to-r from-blue-50 to-purple-50 text-gray-600 border-gray-200 px-3 py-1">
              This Month
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};