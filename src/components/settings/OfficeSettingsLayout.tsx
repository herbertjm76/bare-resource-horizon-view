
import React from 'react';
import { StandardLayout } from '@/components/layout/StandardLayout';

interface OfficeSettingsLayoutProps {
  children: React.ReactNode;
}

export const OfficeSettingsLayout: React.FC<OfficeSettingsLayoutProps> = ({ children }) => {
  return (
    <StandardLayout 
      className="bg-background" 
      contentClassName="p-0"
    >
      <div className="px-4 sm:px-8 py-4 sm:py-8">
        {children}
      </div>
    </StandardLayout>
  );
};
