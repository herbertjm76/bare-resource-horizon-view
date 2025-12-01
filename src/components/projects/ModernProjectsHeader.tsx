
import React from 'react';
import { FolderOpen, BarChart3, Users, Building2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { StandardizedPageHeader } from '@/components/layout/StandardizedPageHeader';

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
    <StandardizedPageHeader
      title="All Projects"
      description="View and manage all your ongoing projects across different locations and teams"
      icon={FolderOpen}
    >
      <Card className="px-4 py-2 bg-gradient-to-r from-theme-primary/10 to-theme-primary/5 border-theme-primary/20">
        <div className="flex items-center gap-2">
          <Users className="h-3.5 w-3.5 text-theme-primary" strokeWidth={1.5} />
          <div className="text-sm">
            <span className="font-semibold text-theme-primary">{totalActiveProjects}</span>
            <span className="text-muted-foreground ml-1">Active</span>
          </div>
        </div>
      </Card>
      
      <Card className="px-4 py-2 bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 border-emerald-500/20">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-3.5 w-3.5 text-emerald-600" strokeWidth={1.5} />
          <div className="text-sm">
            <span className="font-semibold text-emerald-600">{totalProjects}</span>
            <span className="text-muted-foreground ml-1">Projects</span>
          </div>
        </div>
      </Card>
      
      <Card className="px-4 py-2 bg-gradient-to-r from-blue-500/10 to-blue-500/5 border-blue-500/20">
        <div className="flex items-center gap-2">
          <Building2 className="h-3.5 w-3.5 text-blue-600" strokeWidth={1.5} />
          <div className="text-sm">
            <span className="font-semibold text-blue-600">{totalOffices}</span>
            <span className="text-muted-foreground ml-1">Offices</span>
          </div>
        </div>
      </Card>
    </StandardizedPageHeader>
  );
};
