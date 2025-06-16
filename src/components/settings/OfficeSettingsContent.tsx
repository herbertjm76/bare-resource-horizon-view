
import React from 'react';
import { OfficeOverviewCard } from '@/components/settings/OfficeOverviewCard';
import { OfficeSettingsHeader } from '@/components/settings/OfficeSettingsHeader';
import { OfficeSettingsTabs } from '@/components/settings/OfficeSettingsTabs';
import { OfficeSettingsProvider } from '@/context/officeSettings';
import { Toaster } from '@/components/ui/sonner';

interface OfficeSettingsContentProps {
  onRefresh: () => void;
}

export const OfficeSettingsContent: React.FC<OfficeSettingsContentProps> = ({ onRefresh }) => {
  return (
    <>
      <div className="flex-1 p-4 sm:p-8 bg-background">
        <div className="max-w-6xl mx-auto space-y-8">
          <OfficeSettingsProvider>
            <OfficeSettingsHeader onRefresh={onRefresh} />
            <OfficeOverviewCard />
            <OfficeSettingsTabs />
          </OfficeSettingsProvider>
        </div>
      </div>
      <Toaster />
    </>
  );
};
