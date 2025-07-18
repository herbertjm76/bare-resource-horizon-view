
import React from 'react';
import { StandardLayout } from '@/components/layout/StandardLayout';

interface ProfileLayoutProps {
  children: React.ReactNode;
}

export const ProfileLayout: React.FC<ProfileLayoutProps> = ({ children }) => {
  return (
    <StandardLayout 
      className="bg-background"
    >
      <div className="max-w-6xl mx-auto space-y-8">
        {children}
      </div>
    </StandardLayout>
  );
};
