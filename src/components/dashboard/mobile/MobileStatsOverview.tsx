
import React from 'react';
import { TrendingUp, Users, Briefcase } from 'lucide-react';
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
  const getBadgeVariant = () => {
    if (currentUtilizationRate >= 90) return 'error' as const;
    if (currentUtilizationRate >= 75) return 'warning' as const;
    if (currentUtilizationRate >= 50) return 'success' as const;
    return 'info' as const;
  };

  const stats = [
    {
      title: 'Team Members',
      value: activeResources,
      icon: Users
    },
    {
      title: 'Active Projects',
      value: activeProjects,
      icon: Briefcase
    },
    {
      title: 'Team Utilization',
      value: `${currentUtilizationRate}%`,
      icon: TrendingUp,
      badge: utilizationStatus.status,
      badgeVariant: getBadgeVariant()
    }
  ];

  return (
    <div className="grid grid-cols-3 gap-4 w-full">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <div 
            key={index} 
            className="relative overflow-hidden rounded-xl bg-card border glass-card p-4 space-y-3 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <IconComponent className="h-4 w-4" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-muted-foreground truncate tracking-wide uppercase">
                {stat.title}
              </h3>
              <div className="text-2xl font-bold text-foreground tracking-tight">
                {stat.value}
              </div>
              
              {stat.badge && (
                <StandardizedBadge 
                  variant={stat.badgeVariant}
                  size="metric"
                  className="text-xs"
                >
                  {stat.badge}
                </StandardizedBadge>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
