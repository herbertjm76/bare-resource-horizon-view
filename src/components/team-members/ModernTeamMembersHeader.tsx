
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
      {/* Main Header Section with Purple Background */}
      <div className="bg-gradient-to-r from-[#6465F0] via-[#7c6df5] to-[#9c5ef7]">
        <div className="text-center py-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">
              Team Members
            </h1>
          </div>
          <p className="text-white/90 text-lg">
            Manage your team and track member information
          </p>
        </div>
      </div>

      {/* Stats Cards Section */}
      <div className="flex flex-wrap items-center justify-center gap-3">
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
  );
};
