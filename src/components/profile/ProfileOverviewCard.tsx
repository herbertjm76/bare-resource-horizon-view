
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AvatarUpload } from '@/components/profile/AvatarUpload';
import { Mail, User } from 'lucide-react';

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
      <div className="bg-gradient-to-r from-[#9b87f5] via-[#7c3aed] to-[#8b5cf6] p-6 text-white">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row gap-6 items-start">
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
            <div className="flex-1 space-y-4">
              {/* Name Section */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-white/80" />
                  <h2 className="text-2xl font-bold">
                    {profile.first_name || profile.last_name 
                      ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
                      : 'Name not set'
                    }
                  </h2>
                </div>
                
                {/* Email */}
                <div className="flex items-center gap-2 text-white/90">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">{profile.email}</span>
                </div>
              </div>

              {/* Bio Section */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-white/80 uppercase tracking-wide">About</h3>
                <p className="text-white/90 text-sm leading-relaxed">
                  {profile.bio || 'No bio provided yet. Add a bio to tell others about yourself.'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};
