
import React from 'react';
import { Users, BarChart3, Building2, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface ModernTeamMembersHeaderProps {
  totalMembers?: number;
  totalActiveMembers?: number;
  totalDepartments?: number;
  totalLocations?: number;
}

export const ModernTeamMembersHeader: React.FC<ModernTeamMembersHeaderProps> = ({
  totalMembers = 0,
  totalActiveMembers = 0,
  totalDepartments = 0,
  totalLocations = 0
}) => {
  return (
    <div className="space-y-6 mb-6">
      {/* Main Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
            Team Members
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your team and track member information
          </p>
        </div>
        
        {/* Quick Stats Cards - Brand colors: purple, blue, magenta */}
        <div className="flex flex-wrap items-center gap-3">
          <Card className="px-4 py-2 bg-gradient-to-r from-brand-violet/10 to-brand-violet/5 border-brand-violet/20">
            <div className="flex items-center gap-2">
              <Users className="h-3.5 w-3.5 text-brand-violet" strokeWidth={1.5} />
              <div className="text-sm">
                <span className="font-semibold text-brand-violet">{totalActiveMembers}</span>
                <span className="text-muted-foreground ml-1">Active</span>
              </div>
            </div>
          </Card>
          
          <Card className="px-4 py-2 bg-gradient-to-r from-blue-500/10 to-blue-500/5 border-blue-500/20">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-3.5 w-3.5 text-blue-600" strokeWidth={1.5} />
              <div className="text-sm">
                <span className="font-semibold text-blue-600">{totalMembers}</span>
                <span className="text-muted-foreground ml-1">Total</span>
              </div>
            </div>
          </Card>
          
          <Card className="px-4 py-2 bg-gradient-to-r from-fuchsia-500/10 to-fuchsia-500/5 border-fuchsia-500/20">
            <div className="flex items-center gap-2">
              <Building2 className="h-3.5 w-3.5 text-fuchsia-600" strokeWidth={1.5} />
              <div className="text-sm">
                <span className="font-semibold text-fuchsia-600">{totalDepartments}</span>
                <span className="text-muted-foreground ml-1">Departments</span>
              </div>
            </div>
          </Card>
          
          <Card className="px-4 py-2 bg-gradient-to-r from-brand-violet/10 to-brand-violet/5 border-brand-violet/20">
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-brand-violet" strokeWidth={1.5} />
              <div className="text-sm">
                <span className="font-semibold text-brand-violet">{totalLocations}</span>
                <span className="text-muted-foreground ml-1">Locations</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
