
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Briefcase, Sparkles } from 'lucide-react';

interface MobileStatsOverviewProps {
  activeResources: number;
  activeProjects: number;
  currentUtilizationRate: number;
  utilizationStatus: {
    status: string;
    color: string;
    textColor: string;
  };
}

export const MobileStatsOverview: React.FC<MobileStatsOverviewProps> = ({
  activeResources,
  activeProjects,
  currentUtilizationRate,
  utilizationStatus
}) => {
  const getUtilizationBadgeStyle = () => {
    if (currentUtilizationRate >= 90) return 'bg-red-500 text-white border-red-400';
    if (currentUtilizationRate >= 75) return 'bg-orange-500 text-white border-orange-400';
    if (currentUtilizationRate >= 50) return 'bg-green-500 text-white border-green-400';
    return 'bg-blue-500 text-white border-blue-400';
  };

  return (
    <div className="bg-gradient-to-r from-brand-violet to-purple-600 rounded-2xl p-4 text-white w-full">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <div className="p-1.5 bg-white/20 rounded-lg flex-shrink-0">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        Dashboard Overview
      </h2>
      
      {/* Stats Grid - Vertical stack on mobile */}
      <div className="space-y-3 w-full">
        <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl w-full">
          <div className="flex items-center gap-2 min-w-0">
            <div className="p-1.5 bg-white/20 rounded-lg flex-shrink-0">
              <Users className="h-4 w-4 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-white/80 text-xs">Team Members</p>
              <p className="text-xl font-bold">{activeResources}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl w-full">
          <div className="flex items-center gap-2 min-w-0">
            <div className="p-1.5 bg-white/20 rounded-lg flex-shrink-0">
              <Briefcase className="h-4 w-4 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-white/80 text-xs">Active Projects</p>
              <p className="text-xl font-bold">{activeProjects}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl w-full">
          <div className="flex items-center gap-2 min-w-0">
            <div className="p-1.5 bg-white/20 rounded-lg flex-shrink-0">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white/80 text-xs">Team Utilization</p>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-xl font-bold">{currentUtilizationRate}%</p>
                <Badge className={`text-xs whitespace-nowrap ${getUtilizationBadgeStyle()}`}>
                  {utilizationStatus.status}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
