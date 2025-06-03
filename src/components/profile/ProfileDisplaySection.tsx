
import React from 'react';
import { Button } from '@/components/ui/button';
import { Briefcase, Edit3 } from 'lucide-react';

interface ProfileDisplaySectionProps {
  profile: any;
  onEdit: () => void;
}

export const ProfileDisplaySection: React.FC<ProfileDisplaySectionProps> = ({
  profile,
  onEdit
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-bold leading-tight">
            {profile.first_name || profile.last_name 
              ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
              : 'Welcome to your profile'
            }
          </h2>
          {profile.job_title && (
            <p className="text-lg text-white/90 font-medium flex items-center gap-2 mt-1">
              <Briefcase className="h-4 w-4" />
              {profile.job_title}
            </p>
          )}
          {profile.department && (
            <p className="text-white/80 mt-1">{profile.department}</p>
          )}
        </div>
        <Button
          onClick={onEdit}
          size="sm"
          variant="outline"
          className="border-white/30 text-white hover:bg-white/10"
        >
          <Edit3 className="h-4 w-4 mr-1" />
          Edit
        </Button>
      </div>
    </div>
  );
};
