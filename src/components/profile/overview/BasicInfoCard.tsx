
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

        {/* Basic Info with improved hierarchy */}
        <div className="w-full space-y-2">
          {/* Name - Larger and prominent */}
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            {profile.first_name} {profile.last_name}
          </h2>

          {/* Job Title - Secondary prominence */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <Briefcase className="h-4 w-4 text-gray-500" />
            <p className="text-base font-semibold text-gray-800">
              {profile.job_title || 'Not specified'}
            </p>
          </div>

          {/* Department, Email, Location - Supporting info with tighter spacing */}
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-2">
              <User className="h-3 w-3 text-gray-400" />
              <p className="text-sm text-gray-600">
                {profile.department || 'Not specified'}
              </p>
            </div>

            <div className="flex items-center justify-center gap-2">
              <Mail className="h-3 w-3 text-gray-400" />
              <p className="text-sm text-gray-600">
                {profile.email}
              </p>
            </div>

            <div className="flex items-center justify-center gap-2">
              <MapPin className="h-3 w-3 text-gray-400" />
              <p className="text-sm text-gray-600">
                {profile.location || 'Not specified'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
