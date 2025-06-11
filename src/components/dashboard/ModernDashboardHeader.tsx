
import React from 'react';
import { Building2, Users, TrendingUp, FolderOpen, Briefcase, LucideIcon } from 'lucide-react';
import { useUnifiedDashboardData } from './UnifiedDashboardProvider';

interface ModernDashboardHeaderProps {
  totalTeamMembers?: number;
  totalActiveProjects?: number;
  totalOffices?: number;
  utilizationRate?: number;
  customTitle?: string;
  customIcon?: LucideIcon;
}

export const ModernDashboardHeader: React.FC<ModernDashboardHeaderProps> = ({
  totalTeamMembers: propTotalTeamMembers,
  totalActiveProjects: propTotalActiveProjects,
  totalOffices: propTotalOffices,
  utilizationRate: propUtilizationRate,
  customTitle,
  customIcon
}) => {
  // Try to use unified data if available, otherwise fallback to props
  let unifiedData;
  try {
    unifiedData = useUnifiedDashboardData();
  } catch {
    // Context not available, use props
    unifiedData = null;
  }

  // Use unified data if available, otherwise use props
  const totalTeamMembers = unifiedData?.totalTeamSize ?? propTotalTeamMembers ?? 0;
  const totalActiveProjects = unifiedData?.activeProjects ?? propTotalActiveProjects ?? 0;
  const totalOffices = propTotalOffices ?? 1;
  const utilizationRate = unifiedData?.currentUtilizationRate ?? propUtilizationRate ?? 0;

  // Use custom title and icon if provided, otherwise use defaults
  const headerTitle = customTitle || 'Dashboard Overview';
  const HeaderIcon = customIcon || Briefcase;

  const stats = [
    {
      icon: Users,
      label: 'Team Members',
      value: totalTeamMembers,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: FolderOpen,
      label: 'Active Projects',
      value: totalActiveProjects,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: Building2,
      label: 'Offices',
      value: totalOffices,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      icon: TrendingUp,
      label: 'Utilization',
      value: `${utilizationRate}%`,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="bg-gradient-to-br from-white via-gray-50/30 to-gray-100/20 border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Main Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <HeaderIcon className="h-8 w-8 text-brand-primary" />
              {headerTitle}
            </h1>
            <p className="text-gray-600 mt-1">
              Real-time insights into your team and project performance
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <IconComponent className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
