import React from 'react';
import { LayoutDashboard } from 'lucide-react';
import { useCompany } from '@/context/CompanyContext';

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
  const { company } = useCompany();
  
  return (
    <div className="flex flex-wrap items-center gap-2 mb-3 py-2">
      <LayoutDashboard className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" style={{ color: 'hsl(var(--theme-primary))' }} />
      <h1 className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight truncate" style={{ color: 'hsl(var(--theme-primary))' }}>
        {company?.name || 'Company'} Dashboard
      </h1>
      <span className="text-muted-foreground hidden sm:inline">•</span>
      <p className="text-sm text-muted-foreground hidden sm:block truncate">
        Real-time insights into your team and project performance
      </p>
    </div>
  );
};
