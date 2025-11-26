
import React from 'react';
import { Users, BarChart3, Building2, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { StandardizedPageHeader } from '@/components/layout/StandardizedPageHeader';
import { PopulateDepartmentsButton } from '@/components/team/PopulateDepartmentsButton';

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
    <div className="mb-4">
      <div className="flex items-center justify-between mb-3">
        <StandardizedPageHeader
          title="Team Members"
          description="Manage your team and track member information"
          icon={Users}
        />
        <PopulateDepartmentsButton />
      </div>
      
      <div className="grid grid-cols-4 gap-4 mt-4">
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
