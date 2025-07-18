
import React from 'react';
import { StandardLayout } from '@/components/layout/StandardLayout';

interface ProfileLayoutProps {
  children: React.ReactNode;
}

export const ProfileLayout: React.FC<ProfileLayoutProps> = ({ children }) => {
  return (
    <StandardLayout>
      <div className="max-w-6xl mx-auto px-6 py-6 space-y-8">
        {children}
      </div>
    </StandardLayout>
  );
};
