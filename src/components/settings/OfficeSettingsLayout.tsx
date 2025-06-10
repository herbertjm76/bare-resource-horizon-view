
import React from 'react';
import { StandardLayout } from '@/components/layout/StandardLayout';

interface OfficeSettingsLayoutProps {
  children: React.ReactNode;
}

export const OfficeSettingsLayout: React.FC<OfficeSettingsLayoutProps> = ({ children }) => {
  return (
    <StandardLayout 
      className="bg-background" 
      contentClassName=""
    >
      {children}
    </StandardLayout>
  );
};
