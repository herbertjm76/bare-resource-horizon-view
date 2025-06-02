
import React from 'react';
import { User } from 'lucide-react';

export const ProfileHeader: React.FC = () => {
  return (
    <div className="space-y-2">
      <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-brand-primary flex items-center gap-3">
        <User className="h-8 w-8 text-brand-violet" />
        My Profile
      </h1>
      <p className="text-lg text-gray-600">Manage your personal and professional information</p>
    </div>
  );
};
