import React from 'react';
import { StandardLayout } from '@/components/layout';
import { WeeklyRundownView } from '@/components/weekly-rundown/WeeklyRundownView';
import { OfficeSettingsProvider } from '@/context/officeSettings';

const WeeklyRundown: React.FC = () => {
  return (
    <StandardLayout 
      title="Weekly Rundown"
      className="bg-background"
      contentClassName="p-4 sm:p-6 lg:p-8"
    >
      <OfficeSettingsProvider>
        <WeeklyRundownView />
      </OfficeSettingsProvider>
    </StandardLayout>
  );
};

export default WeeklyRundown;