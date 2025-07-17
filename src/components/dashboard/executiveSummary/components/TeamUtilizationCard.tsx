import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from 'lucide-react';

interface TeamUtilizationCardProps {
  utilizationRate: number;
  utilizationStatus: {
    color: string;
    label: string;
  };
}

export const TeamUtilizationCard: React.FC<TeamUtilizationCardProps> = ({
  utilizationRate,
  utilizationStatus
}) => {
  return (
    <Card className="rounded-xl border-0 shadow-sm h-full" style={{ background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)' }}>
      <CardContent className="p-3 h-full flex flex-col justify-between">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5 text-white/90" />
            <span className="text-[10px] font-medium text-white/90 tracking-wider">TEAM UTILIZATION</span>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col justify-center">
          <div className="relative w-16 h-16 mx-auto mb-2">
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="4"/>
              <circle 
                cx="32" 
                cy="32" 
                r="24" 
                fill="none" 
                stroke="white" 
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${Math.min(utilizationRate / 100 * 150.8, 150.8)} 150.8`}
                className="transition-all duration-700"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-white">{Math.round(utilizationRate)}%</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <Badge className="text-[10px] border-white/30 text-white bg-white/15 px-2 py-0.5">
            {utilizationStatus.label}
          </Badge>
          <span className="text-[10px] text-white/70">This Month</span>
        </div>
      </CardContent>
    </Card>
  );
};