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
    <Card className="rounded-xl border-0 shadow-sm h-full" style={{ background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)' }}>
      <CardContent className="p-3 h-full flex flex-col">
        <div className="flex items-center gap-1.5 mb-2">
          <Calendar className="h-3.5 w-3.5 text-white/90" />
          <span className="text-[10px] font-medium text-white/90 tracking-wider">TEAM LEAVE</span>
        </div>
        
        <div className="flex-1 flex flex-col">
          {/* Chart area */}
          <div className="relative h-20 flex-1">
            <svg className="w-full h-full" viewBox="0 0 280 80">
              {/* Define gradient for area fill */}
              <defs>
                <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.4)" stopOpacity="1"/>
                  <stop offset="100%" stopColor="rgba(255,255,255,0.1)" stopOpacity="0"/>
                </linearGradient>
              </defs>
              
              {/* Area fill */}
              <path
                d={`M 0 80 ${data.map((value, index) => {
                  const x = (index * 280) / (data.length - 1);
                  const y = 80 - ((value - minValue) / (maxValue - minValue)) * 60;
                  return `L ${x} ${y}`;
                }).join(' ')} L 280 80 Z`}
                fill="url(#areaGradient)"
                className="transition-all duration-300"
              />
              
              {/* Line chart */}
              <polyline
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={data.map((value, index) => {
                  const x = (index * 280) / (data.length - 1);
                  const y = 80 - ((value - minValue) / (maxValue - minValue)) * 60;
                  return `${x},${y}`;
                }).join(' ')}
              />
              
              {/* Data points */}
              {data.map((value, index) => {
                const x = (index * 280) / (data.length - 1);
                const y = 80 - ((value - minValue) / (maxValue - minValue)) * 60;
                return (
                  <circle
                    key={index}
                    cx={x}
                    cy={y}
                    r="2"
                    fill="white"
                    className="drop-shadow-sm"
                  />
                );
              })}
            </svg>
          </div>
          
          {/* Day labels */}
          <div className="grid grid-cols-7 gap-0.5 text-[9px] text-white/70 text-center mt-1">
            {days.map(day => (
              <span key={day}>{day}</span>
            ))}
          </div>
          
          <div className="text-center mt-1">
            <span className="text-[10px] text-white/70">This Month</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};