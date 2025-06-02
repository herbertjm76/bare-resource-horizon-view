
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AvatarUpload } from '@/components/profile/AvatarUpload';
import { Mail, User, MapPin, Calendar } from 'lucide-react';

interface ProfileOverviewCardProps {
  profile: any;
  getUserInitials: () => string;
  handleAvatarUpdate: (url: string | null) => void;
}

export const ProfileOverviewCard: React.FC<ProfileOverviewCardProps> = ({
  profile,
  getUserInitials,
  handleAvatarUpdate
}) => {
  return (
    <Card className="overflow-hidden">
      <div className="bg-gradient-to-r from-[#9b87f5] via-[#7c3aed] to-[#8b5cf6] p-8 text-white relative">
        {/* Decorative background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
        
        <CardContent className="p-0 relative z-10">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Avatar Section */}
            <div className="flex-shrink-0">
              <AvatarUpload
                currentAvatarUrl={profile.avatar_url}
                userId={profile.id}
                onAvatarUpdate={handleAvatarUpdate}
                userInitials={getUserInitials()}
              />
            </div>

            {/* Profile Info Section */}
            <div className="flex-1 space-y-6">
              {/* Name and Title Section */}
              <div className="space-y-3">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold leading-tight">
                    {profile.first_name || profile.last_name 
                      ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
                      : 'Name not set'
                    }
                  </h2>
                  {profile.job_title && (
                    <p className="text-lg text-white/90 font-medium">{profile.job_title}</p>
                  )}
                  {profile.department && (
                    <p className="text-white/80">{profile.department}</p>
                  )}
                </div>
                
                {/* Contact Info */}
                <div className="flex flex-col sm:flex-row gap-4 text-sm">
                  <div className="flex items-center gap-2 text-white/90">
                    <Mail className="h-4 w-4" />
                    <span>{profile.email}</span>
                  </div>
                  {profile.location && (
                    <div className="flex items-center gap-2 text-white/90">
                      <MapPin className="h-4 w-4" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  {profile.start_date && (
                    <div className="flex items-center gap-2 text-white/90">
                      <Calendar className="h-4 w-4" />
                      <span>Started {new Date(profile.start_date).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bio Section */}
              {profile.bio && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-white/80 uppercase tracking-wide">About</h3>
                  <p className="text-white/90 text-sm leading-relaxed max-w-2xl">
                    {profile.bio}
                  </p>
                </div>
              )}

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-6 pt-2">
                <div className="text-center">
                  <div className="text-2xl font-bold">{profile.weekly_capacity}h</div>
                  <div className="text-xs text-white/70 uppercase tracking-wide">Weekly Capacity</div>
                </div>
                {profile.department && (
                  <div className="text-center">
                    <div className="text-lg font-semibold text-white/90">{profile.department}</div>
                    <div className="text-xs text-white/70 uppercase tracking-wide">Department</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};
