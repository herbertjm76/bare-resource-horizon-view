
import React from 'react';
import { LayoutDashboard, Users, Briefcase, Building2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useCompany } from '@/context/CompanyContext';

interface ModernDashboardHeaderProps {
  totalTeamMembers?: number;
  totalActiveProjects?: number;
  totalOffices?: number;
  utilizationRate?: number;
  customTitle?: string;
  customIcon?: React.ComponentType<any>;
}

export const ModernDashboardHeader: React.FC<ModernDashboardHeaderProps> = ({
  totalTeamMembers = 0,
  totalActiveProjects = 0,
  totalOffices = 0,
  utilizationRate = 0,
  customTitle,
  customIcon: CustomIcon
}) => {
  const { company } = useCompany();
  const companyName = company?.name || 'Your Company';

  // Use custom title and icon if provided, otherwise use default dashboard
  const title = customTitle || `${companyName} Dashboard`;
  const IconComponent = CustomIcon || LayoutDashboard;

  return (
    <div className="space-y-6 p-4 sm:p-8">
      {/* Main Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-brand-primary flex items-center gap-3">
            <IconComponent className="h-8 w-8 text-brand-violet" strokeWidth={1.5} />
            {title}
          </h1>
        </div>
        
        {/* Quick Stats Cards - Brand colors: purple, blue, magenta */}
        <div className="flex flex-wrap items-center gap-3">
          <Card className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-brand-violet/10 to-brand-violet/5 border-brand-violet/20">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-brand-violet" strokeWidth={1.5} />
              <div className="text-xs sm:text-sm">
                <span className="font-semibold text-brand-violet">{totalTeamMembers}</span>
                <span className="text-muted-foreground ml-1">Members</span>
              </div>
            </div>
          </Card>
          
          <Card className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-blue-500/10 to-blue-500/5 border-blue-500/20">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Briefcase className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600" strokeWidth={1.5} />
              <div className="text-xs sm:text-sm">
                <span className="font-semibold text-blue-600">{totalActiveProjects}</span>
                <span className="text-muted-foreground ml-1">Projects</span>
              </div>
            </div>
          </Card>
          
          <Card className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-fuchsia-500/10 to-fuchsia-500/5 border-fuchsia-500/20">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Building2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-fuchsia-600" strokeWidth={1.5} />
              <div className="text-xs sm:text-sm">
                <span className="font-semibold text-fuchsia-600">{totalOffices}</span>
                <span className="text-muted-foreground ml-1">Offices</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
