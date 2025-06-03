
import React from 'react';
import { Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProfileDisplaySectionProps {
  profile: any;
  onEdit: () => void;
}

export const ProfileDisplaySection: React.FC<ProfileDisplaySectionProps> = ({
  profile,
  onEdit
}) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black">
            {profile.first_name} {profile.last_name}
          </h1>
          {profile.job_title && (
            <p className="text-lg text-black/80 mt-1">
              {profile.job_title}
            </p>
          )}
        </div>
        <Button
          onClick={onEdit}
          variant="outline"
          size="sm"
          className="bg-white/20 border-white/30 text-black hover:bg-white/30 hover:text-black"
        >
          <Edit2 className="h-4 w-4 mr-2" />
          Edit
        </Button>
      </div>
    </>
  );
};
