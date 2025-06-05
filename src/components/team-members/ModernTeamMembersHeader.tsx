
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
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-brand-primary flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-brand-violet to-purple-600">
              <Users className="h-8 w-8 text-white" />
            </div>
            Team Members
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your team members, roles, and organizational structure
          </p>
        </div>
        
        {/* Quick Stats Cards */}
        <div className="flex flex-wrap items-center gap-3">
          <Card className="px-4 py-2 bg-gradient-to-r from-brand-violet/10 to-brand-violet/5 border-brand-violet/20">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded bg-gradient-to-br from-brand-violet to-purple-600">
                <Users className="h-3.5 w-3.5 text-white" />
              </div>
              <div className="text-sm">
                <span className="font-semibold text-brand-violet">{totalActiveMembers}</span>
                <span className="text-muted-foreground ml-1">Active</span>
              </div>
            </div>
          </Card>
          
          <Card className="px-4 py-2 bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 border-emerald-500/20">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded bg-gradient-to-br from-emerald-500 to-emerald-600">
                <BarChart3 className="h-3.5 w-3.5 text-white" />
              </div>
              <div className="text-sm">
                <span className="font-semibold text-emerald-600">{totalMembers}</span>
                <span className="text-muted-foreground ml-1">Total</span>
              </div>
            </div>
          </Card>
          
          <Card className="px-4 py-2 bg-gradient-to-r from-blue-500/10 to-blue-500/5 border-blue-500/20">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded bg-gradient-to-br from-blue-500 to-blue-600">
                <Building2 className="h-3.5 w-3.5 text-white" />
              </div>
              <div className="text-sm">
                <span className="font-semibold text-blue-600">{totalDepartments}</span>
                <span className="text-muted-foreground ml-1">Departments</span>
              </div>
            </div>
          </Card>
          
          <Card className="px-4 py-2 bg-gradient-to-r from-purple-500/10 to-purple-500/5 border-purple-500/20">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded bg-gradient-to-br from-purple-500 to-purple-600">
                <Clock className="h-3.5 w-3.5 text-white" />
              </div>
              <div className="text-sm">
                <span className="font-semibold text-purple-600">{totalLocations}</span>
                <span className="text-muted-foreground ml-1">Locations</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
