
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { TeamUtilizationKPI } from './kpi/TeamUtilizationKPI';
import { OverCapacityKPI } from './kpi/OverCapacityKPI';
import { ActiveProjectsKPI } from './kpi/ActiveProjectsKPI';
import { TeamSizeKPI } from './kpi/TeamSizeKPI';

interface ModernDashboardHeaderProps {
  totalTeamMembers: number;
  totalActiveProjects: number;
  totalOffices: number;
  utilizationRate: number;
}

export const ModernDashboardHeader: React.FC<ModernDashboardHeaderProps> = ({
  totalTeamMembers,
  totalActiveProjects,
  totalOffices,
  utilizationRate
}) => {
  return (
    <div className="bg-gradient-to-r from-[#6465F0] via-[#7c6df5] to-[#9c5ef7]">
      <div className="text-center py-6">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">📊</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">
            ABC Studios Dashboard
          </h1>
        </div>
        <p className="text-white/90 text-lg">
          Real-time insights into your team and project performance
        </p>
      </div>
      
      <div className="px-6 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <TeamUtilizationKPI utilizationRate={utilizationRate} />
          <OverCapacityKPI overCapacityHours={624} />
          <ActiveProjectsKPI 
            activeProjects={totalActiveProjects} 
            activeResources={totalTeamMembers}
          />
          <TeamSizeKPI 
            teamSize={totalTeamMembers} 
            recommendHiring={utilizationRate > 100}
          />
        </div>
      </div>
    </div>
  );
};
