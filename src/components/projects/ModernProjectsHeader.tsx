
import React from 'react';
import { FolderOpen, BarChart3, Users, Building2 } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface ModernProjectsHeaderProps {
  totalProjects?: number;
  totalActiveProjects?: number;
  totalOffices?: number;
}

export const ModernProjectsHeader: React.FC<ModernProjectsHeaderProps> = ({
  totalProjects = 0,
  totalActiveProjects = 0,
  totalOffices = 0
}) => {
  return (
    <div className="space-y-6 mb-6">
      {/* Main Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-brand-primary flex items-center gap-3">
            <FolderOpen className="h-8 w-8 text-brand-violet" />
            All Projects
          </h1>
          <p className="text-muted-foreground text-lg">
            View and manage all your ongoing projects across different locations and teams
          </p>
        </div>
        
        {/* Quick Stats Cards */}
        <div className="flex flex-wrap items-center gap-3">
          <Card className="px-4 py-2 bg-gradient-to-r from-brand-violet/10 to-brand-violet/5 border-brand-violet/20">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-brand-violet" />
              <div className="text-sm">
                <span className="font-semibold text-brand-violet">{totalActiveProjects}</span>
                <span className="text-muted-foreground ml-1">Active</span>
              </div>
            </div>
          </Card>
          
          <Card className="px-4 py-2 bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 border-emerald-500/20">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-emerald-600" />
              <div className="text-sm">
                <span className="font-semibold text-emerald-600">{totalProjects}</span>
                <span className="text-muted-foreground ml-1">Projects</span>
              </div>
            </div>
          </Card>
          
          <Card className="px-4 py-2 bg-gradient-to-r from-blue-500/10 to-blue-500/5 border-blue-500/20">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-blue-600" />
              <div className="text-sm">
                <span className="font-semibold text-blue-600">{totalOffices}</span>
                <span className="text-muted-foreground ml-1">Offices</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
