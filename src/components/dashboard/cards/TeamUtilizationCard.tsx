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
  utilizationRate = 85,
  status,
  utilizationStatus
}) => {
  // Calculate stroke dash array for circle progress
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (utilizationRate / 100) * circumference;

  // Determine status and color based on utilization rate
  const finalStatus = status || utilizationStatus?.status || (utilizationRate > 100 ? "Over Capacity" : "Normal");
  const isOverCapacity = utilizationRate > 100;
  const strokeColor = isOverCapacity ? "#ef4444" : "#22c55e";

  return (
    <Card className="rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-gray-600" />
            <span className="text-xs font-semibold text-gray-700 tracking-wide">TEAM UTILIZATION</span>
          </div>
        </div>
        
        <div className="flex flex-col items-center space-y-4">
          {/* Circular Progress */}
          <div className="relative w-24 h-24">
            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke="rgba(0,0,0,0.1)"
                strokeWidth="8"
                fill="transparent"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke={strokeColor}
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-300"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-900">{Math.round(utilizationRate)}</span>
            </div>
          </div>
          
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">Here are some of the tricks to</p>
            <p className="text-sm text-gray-600">improve your score</p>
            
            <div className="flex flex-col items-center gap-2 mt-4">
              <Badge className={`text-xs ${isOverCapacity ? 'bg-red-100 text-red-700 border-red-200' : 'bg-green-100 text-green-700 border-green-200'}`}>
                {finalStatus}
              </Badge>
              <span className="text-xs text-gray-500">This Month</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};