
import React from 'react';
import { LayoutDashboard, LucideIcon } from 'lucide-react';
import { useUnifiedDashboardData } from './UnifiedDashboardProvider';
import { useCompany } from '@/context/CompanyContext';

interface ModernDashboardHeaderProps {
  totalTeamMembers?: number;
  totalActiveProjects?: number;
  totalOffices?: number;
  utilizationRate?: number;
  customTitle?: string;
  customIcon?: LucideIcon;
}

export const ModernDashboardHeader: React.FC<ModernDashboardHeaderProps> = ({
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

  const { company } = useCompany();

  // Use custom title and icon if provided, otherwise use defaults
  const companyName = company?.name || 'Company';
  const headerTitle = customTitle || `${companyName} Dashboard`;
  const HeaderIcon = customIcon || LayoutDashboard;

  return (
    <div className="bg-gradient-to-br from-white via-gray-50/30 to-gray-100/20 border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Main Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-brand-primary flex items-center gap-3">
              <HeaderIcon className="h-8 w-8 text-brand-primary" />
              {headerTitle}
            </h1>
            <p className="text-gray-600 mt-1">
              Real-time insights into your team and project performance
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
