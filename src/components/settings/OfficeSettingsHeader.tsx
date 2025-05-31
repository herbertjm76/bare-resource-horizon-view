
import React from 'react';
import { Settings, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OfficeSettingsHeaderProps {
  onRefresh: () => void;
}

export const OfficeSettingsHeader: React.FC<OfficeSettingsHeaderProps> = ({ onRefresh }) => {
  return (
    <div className="space-y-6 mb-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-brand-primary flex items-center gap-3">
            <Settings className="h-8 w-8 text-brand-violet" />
            Office Settings
          </h1>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRefresh}
          className="gap-2 h-9"
        >
          <RefreshCw className="h-4 w-4" /> 
          Refresh
        </Button>
      </div>
    </div>
  );
};
