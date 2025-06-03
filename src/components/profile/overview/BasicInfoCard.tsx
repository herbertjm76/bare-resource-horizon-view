
import React from 'react';
import { Card } from '@/components/ui/card';
import { AvatarUpload } from '@/components/profile/AvatarUpload';
import { Briefcase, User, Mail, MapPin } from 'lucide-react';

interface BasicInfoCardProps {
  profile: any;
  getUserInitials: () => string;
  handleAvatarUpdate: (url: string | null) => void;
}

export const BasicInfoCard: React.FC<BasicInfoCardProps> = ({
  profile,
  getUserInitials,
  handleAvatarUpdate
}) => {
  return (
    <Card className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm lg:col-span-2">
      <div className="flex flex-col items-center text-center space-y-4">
        {/* Profile Picture */}
        <AvatarUpload
          currentAvatarUrl={profile.avatar_url}
          userId={profile.id}
          onAvatarUpdate={handleAvatarUpdate}
          userInitials={getUserInitials()}
        />

        {/* Basic Info */}
        <div className="w-full space-y-3">
          <div className="space-y-3">
            <div className="flex items-center justify-center">
              <h3 className="text-xl font-bold text-gray-900">
                {profile.first_name} {profile.last_name}
              </h3>
            </div>

            <div className="flex items-center justify-center gap-2">
              <Briefcase className="h-4 w-4 text-gray-500" />
              <p className="text-lg font-medium text-gray-700">
                {profile.job_title || 'Not specified'}
              </p>
            </div>

            <div className="flex items-center justify-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              <p className="text-lg font-medium text-gray-700">
                {profile.department || 'Not specified'}
              </p>
            </div>

            <div className="flex items-center justify-center gap-2">
              <Mail className="h-4 w-4 text-gray-500" />
              <p className="text-lg font-medium text-gray-700">
                {profile.email}
              </p>
            </div>

            <div className="flex items-center justify-center gap-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <p className="text-lg font-medium text-gray-700">
                {profile.location || 'Not specified'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
