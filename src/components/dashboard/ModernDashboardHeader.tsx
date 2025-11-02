import React from 'react';
import { LayoutDashboard } from 'lucide-react';

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
    <div className="bg-card/50 border border-border rounded-lg shadow-sm">
      <div className="text-center py-6">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'hsl(var(--theme-primary) / 0.1)' }}>
            <LayoutDashboard className="h-5 w-5" style={{ color: 'hsl(var(--theme-primary))' }} />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight" style={{ color: 'hsl(var(--theme-primary))' }}>
            ABC Studios Dashboard
          </h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Real-time insights into your team and project performance
        </p>
      </div>
    </div>
  );
};
