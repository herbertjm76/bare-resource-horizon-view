
import React from 'react';
import { TrendingUp, Users, Briefcase, Sparkles } from 'lucide-react';
import { StandardizedBadge } from "@/components/ui/standardized-badge";

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
    if (currentUtilizationRate >= 90) return { backgroundColor: '#ef4444', color: 'white' };
    if (currentUtilizationRate >= 75) return { backgroundColor: '#f97316', color: 'white' };
    if (currentUtilizationRate >= 50) return { backgroundColor: '#22c55e', color: 'white' };
    return { backgroundColor: '#3b82f6', color: 'white' };
  };

  return (
    <div className="bg-gradient-to-r from-brand-violet to-purple-600 rounded-2xl p-4 text-white w-full">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-white" strokeWidth={1.5} />
        Dashboard Overview
      </h2>
      
      {/* Stats Grid - Vertical stack on mobile */}
      <div className="space-y-3 w-full">
        <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl w-full">
          <div className="flex items-center gap-2 min-w-0">
            <Users className="h-5 w-5 text-white" strokeWidth={1.5} />
            <div className="min-w-0">
              <p className="text-white/80 text-xs">Team Members</p>
              <p className="text-xl font-bold">{activeResources}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl w-full">
          <div className="flex items-center gap-2 min-w-0">
            <Briefcase className="h-5 w-5 text-white" strokeWidth={1.5} />
            <div className="min-w-0">
              <p className="text-white/80 text-xs">Active Projects</p>
              <p className="text-xl font-bold">{activeProjects}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl w-full">
          <div className="flex items-center gap-2 min-w-0">
            <TrendingUp className="h-5 w-5 text-white" strokeWidth={1.5} />
            <div className="min-w-0 flex-1">
              <p className="text-white/80 text-xs">Team Utilization</p>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-xl font-bold">{currentUtilizationRate}%</p>
                <StandardizedBadge
                  variant="status"
                  style={getUtilizationBadgeStyle()}
                  className="text-xs whitespace-nowrap"
                >
                  {utilizationStatus.status}
                </StandardizedBadge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
