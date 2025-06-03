
import React from 'react';
import { Clock } from 'lucide-react';

interface ProfileStatsProps {
  profile: any;
}

export const ProfileStats: React.FC<ProfileStatsProps> = ({ profile }) => {
  return (
    <div className="flex flex-wrap gap-6 pt-2">
      <div className="text-center">
        <div className="text-xl font-bold flex items-center gap-1">
          <Clock className="h-4 w-4" />
          {profile.weekly_capacity || 40}h
        </div>
        <div className="text-xs text-white/70 uppercase tracking-wide">Weekly Capacity</div>
      </div>
      {profile.start_date && (
        <div className="text-center">
          <div className="text-lg font-semibold text-white/90">
            {Math.floor((new Date().getTime() - new Date(profile.start_date).getTime()) / (1000 * 60 * 60 * 24 * 365))} years
          </div>
          <div className="text-xs text-white/70 uppercase tracking-wide">Experience Here</div>
        </div>
      )}
    </div>
  );
};
