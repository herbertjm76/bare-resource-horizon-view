import React from 'react';
import { StandardLayout } from '@/components/layout';
import { WeeklyRundownView } from '@/components/weekly-rundown/WeeklyRundownView';

const WeeklyRundown: React.FC = () => {
  return (
    <StandardLayout 
      title="Weekly Rundown"
      className="bg-background"
      contentClassName="p-4 sm:p-6 lg:p-8"
    >
      <WeeklyRundownView />
    </StandardLayout>
  );
};

export default WeeklyRundown;