
import React from 'react';
import { Settings, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StandardizedPageHeader } from '@/components/layout/StandardizedPageHeader';

interface OfficeSettingsHeaderProps {
  onRefresh: () => void;
}

export const OfficeSettingsHeader: React.FC<OfficeSettingsHeaderProps> = ({ onRefresh }) => {
  return (
    <StandardizedPageHeader
      title="Office Settings"
      description="Configure your workspace settings, departments, locations, and team structure"
      icon={Settings}
    >
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onRefresh}
        className="gap-2 h-9 bg-background"
      >
        <RefreshCw className="h-4 w-4" /> 
        Refresh
      </Button>
    </StandardizedPageHeader>
  );
};
