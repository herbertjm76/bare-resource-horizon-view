
import React from 'react';
import { OfficeOverviewCard } from '@/components/settings/OfficeOverviewCard';
import { OfficeSettingsHeader } from '@/components/settings/OfficeSettingsHeader';
import { OfficeSettingsTabs } from '@/components/settings/OfficeSettingsTabs';
import { OfficeSettingsProvider } from '@/context/officeSettings';

interface OfficeSettingsContentProps {
  onRefresh: () => void;
}

export const OfficeSettingsContent: React.FC<OfficeSettingsContentProps> = ({ onRefresh }) => {
  return (
    <div className="flex-1 p-4 sm:p-8 bg-background">
      <div className="max-w-6xl mx-auto space-y-8">
        <OfficeSettingsHeader onRefresh={onRefresh} />
        <OfficeOverviewCard />
        
        <OfficeSettingsProvider>
          <OfficeSettingsTabs />
        </OfficeSettingsProvider>
      </div>
    </div>
  );
};
