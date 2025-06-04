
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
  return (
    <div className="bg-gradient-to-r from-brand-violet to-purple-600 rounded-2xl p-6 text-white">
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <Sparkles className="h-5 w-5" />
        Dashboard Overview
      </h2>
      
      {/* Stats Grid - Vertical on mobile */}
      <div className="space-y-4">
        <div className="flex justify-between items-center p-4 bg-white/10 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-white/80 text-sm">Team Members</p>
              <p className="text-2xl font-bold">{activeResources}</p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center p-4 bg-white/10 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <p className="text-white/80 text-sm">Active Projects</p>
              <p className="text-2xl font-bold">{activeProjects}</p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center p-4 bg-white/10 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-white/80 text-sm">Team Utilization</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold">{currentUtilizationRate}%</p>
                <Badge 
                  variant="secondary" 
                  className="bg-white/20 text-white border-white/30 text-xs"
                >
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
