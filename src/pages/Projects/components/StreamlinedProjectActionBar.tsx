import React from 'react';
import { Button } from '@/components/ui/button';
import { Settings, Users, Download, Filter } from 'lucide-react';

interface StreamlinedProjectActionBarProps {
  onProjectConfig: () => void;
  onTeamManagement: () => void;
}

export const StreamlinedProjectActionBar: React.FC<StreamlinedProjectActionBarProps> = ({
  onProjectConfig,
  onTeamManagement
}) => {
  return (
    <div className="bg-muted/30 border border-border rounded-lg p-3">
      <div className="flex flex-wrap items-center gap-3">
        
        {/* Primary actions */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onProjectConfig} className="h-8">
            <Settings className="h-3 w-3 mr-2" />
            Project Configuration
          </Button>
          <Button variant="outline" size="sm" onClick={onTeamManagement} className="h-8">
            <Users className="h-3 w-3 mr-2" />
            Team Management
          </Button>
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-border" />

        {/* Filter placeholder */}
        <Button variant="outline" size="sm" className="h-8">
          <Filter className="h-3 w-3 mr-2" />
          Filter
        </Button>

        {/* Spacer to push secondary actions to the right */}
        <div className="flex-1" />

        {/* Secondary actions */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8">
            <Download className="h-3 w-3 mr-2" />
            Export
          </Button>
        </div>
      </div>
    </div>
  );
};