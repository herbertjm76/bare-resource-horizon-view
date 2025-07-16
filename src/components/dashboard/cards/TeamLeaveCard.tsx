import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from 'lucide-react';

interface TeamLeaveCardProps {
  leaveData?: number[];
  teamMembers?: any[];
}

export const TeamLeaveCard: React.FC<TeamLeaveCardProps> = ({
  leaveData,
  teamMembers = []
}) => {
  // Generate leave data based on team size and trends
  const generateLeaveData = () => {
    const teamSize = teamMembers.length || 1;
    const baseLeave = teamSize * 2; // Base 2 hours per person per day
    
    return Array.from({ length: 7 }, (_, index) => {
      // Create realistic leave patterns (lower on weekends, higher mid-week)
      const dayMultiplier = index === 0 || index === 6 ? 0.3 : 1; // Weekend reduction
      const variation = Math.random() * 0.5 + 0.75; // 75-125% variation
      return Math.round(baseLeave * dayMultiplier * variation);
    });
  };
  
  const data = leaveData || generateLeaveData();
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const maxValue = Math.max(...data, 10); // Ensure minimum scale
  const minValue = Math.min(...data);

  return (
    <Card className="rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-600" />
            <span className="text-xs font-semibold text-gray-700 tracking-wide">TEAM LEAVE</span>
          </div>
        </div>
        
        <div className="space-y-4">
          {/* Chart area */}
          <div className="relative h-24">
            <svg className="w-full h-full" viewBox="0 0 280 96">
              {/* Grid lines */}
              {[0, 25, 50, 75].map(y => (
                <line
                  key={y}
                  x1="0"
                  y1={96 - y}
                  x2="280"
                  y2={96 - y}
                  stroke="rgba(0,0,0,0.1)"
                  strokeWidth="1"
                />
              ))}
              
              {/* Line chart */}
              <polyline
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={data.map((value, index) => {
                  const x = (index * 280) / (data.length - 1);
                  const y = 96 - ((value - minValue) / (maxValue - minValue)) * 76;
                  return `${x},${y}`;
                }).join(' ')}
              />
              
              {/* Data points */}
              {data.map((value, index) => {
                const x = (index * 280) / (data.length - 1);
                const y = 96 - ((value - minValue) / (maxValue - minValue)) * 76;
                return (
                  <circle
                    key={index}
                    cx={x}
                    cy={y}
                    r="3"
                    fill="#8b5cf6"
                    className="hover:r-4 transition-all duration-200"
                  />
                );
              })}
            </svg>
          </div>
          
          {/* Day labels */}
          <div className="grid grid-cols-7 gap-1 text-xs text-gray-500 text-center">
            {days.map(day => (
              <span key={day}>{day}</span>
            ))}
          </div>
          
          <div className="text-center pt-2">
            <span className="text-xs text-gray-500">This Month</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};