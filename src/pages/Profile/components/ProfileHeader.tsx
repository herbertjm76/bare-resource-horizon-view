
import React from 'react';
import { User } from 'lucide-react';
import { StandardizedPageHeader } from '@/components/layout/StandardizedPageHeader';

export const ProfileHeader: React.FC = () => {
  return (
    <StandardizedPageHeader
      title="My Profile"
      description="Manage your personal and professional information"
      icon={User}
    />
  );
};
