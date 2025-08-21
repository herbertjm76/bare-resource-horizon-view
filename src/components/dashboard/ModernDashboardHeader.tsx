
import React from 'react';

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
    <div className="bg-gradient-to-r from-indigo-950 to-purple-950 rounded-lg">
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
    </div>
  );
};
