import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
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
    <Card className="rounded-2xl border border-purple-500/20 shadow-lg hover:shadow-xl transition-shadow" style={{ background: '#494D9C' }}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-white/90" />
            <span className="text-xs font-semibold text-white/90 tracking-wide">TEAM LEAVE</span>
          </div>
        </div>
        
        <div className="flex flex-col justify-between h-full">
          {/* Chart area */}
          <div className="relative h-32 mt-2">
            <svg className="w-full h-full" viewBox="0 0 280 128">
              {/* Grid lines */}
              {[0, 32, 64, 96].map(y => (
                <line
                  key={y}
                  x1="0"
                  y1={128 - y}
                  x2="280"
                  y2={128 - y}
                  stroke="rgba(0,0,0,0.1)"
                  strokeWidth="1"
                />
              ))}
              
              {/* Define gradient for area fill */}
              <defs>
                <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3"/>
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05"/>
                </linearGradient>
              </defs>
              
              {/* Area fill */}
              <path
                d={`M 0 128 ${data.map((value, index) => {
                  const x = (index * 280) / (data.length - 1);
                  const y = 128 - ((value - minValue) / (maxValue - minValue)) * 108;
                  return `L ${x} ${y}`;
                }).join(' ')} L 280 128 Z`}
                fill="url(#areaGradient)"
                className="transition-all duration-300"
              />
              
              {/* Line chart */}
              <polyline
                fill="none"
                stroke="#3b82f6"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={data.map((value, index) => {
                  const x = (index * 280) / (data.length - 1);
                  const y = 128 - ((value - minValue) / (maxValue - minValue)) * 108;
                  return `${x},${y}`;
                }).join(' ')}
              />
              
              {/* Data points */}
              {data.map((value, index) => {
                const x = (index * 280) / (data.length - 1);
                const y = 128 - ((value - minValue) / (maxValue - minValue)) * 108;
                return (
                  <circle
                    key={index}
                    cx={x}
                    cy={y}
                    r="4"
                    fill="#3b82f6"
                    stroke="white"
                    strokeWidth="2"
                    className="hover:r-5 transition-all duration-200"
                  />
                );
              })}
            </svg>
          </div>
          
          {/* Day labels */}
          <div className="grid grid-cols-7 gap-1 text-xs text-white/60 text-center">
            {days.map(day => (
              <span key={day}>{day}</span>
            ))}
          </div>
          
          <div className="text-center">
            <span className="text-xs text-white/60">This Month</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};