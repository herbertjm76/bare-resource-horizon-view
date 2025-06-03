
import React from 'react';
import { Mail, Phone } from 'lucide-react';

interface ProfileContactInfoProps {
  profile: any;
}

export const ProfileContactInfo: React.FC<ProfileContactInfoProps> = ({
  profile
}) => {
  return (
    <div className="flex flex-wrap gap-4 text-sm">
      {profile.email && (
        <div className="flex items-center gap-2 text-black/80">
          <Mail className="h-4 w-4" />
          <span>{profile.email}</span>
        </div>
      )}
      {profile.phone && (
        <div className="flex items-center gap-2 text-black/80">
          <Phone className="h-4 w-4" />
          <span>{profile.phone}</span>
        </div>
      )}
    </div>
  );
};
