
import React from 'react';
import { Mail, MapPin, Calendar } from 'lucide-react';

interface ProfileContactInfoProps {
  profile: any;
}

export const ProfileContactInfo: React.FC<ProfileContactInfoProps> = ({ profile }) => {
  return (
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
  );
};
