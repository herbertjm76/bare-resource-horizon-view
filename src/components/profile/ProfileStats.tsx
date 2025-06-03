
import React from 'react';
import { Calendar, MapPin, Briefcase } from 'lucide-react';

interface ProfileStatsProps {
  profile: any;
}

export const ProfileStats: React.FC<ProfileStatsProps> = ({ profile }) => {
  const stats = [
    ...(profile.start_date ? [{
      icon: Calendar,
      label: 'Start Date',
      value: new Date(profile.start_date).toLocaleDateString()
    }] : []),
    ...(profile.location ? [{
      icon: MapPin,
      label: 'Location',
      value: profile.location
    }] : []),
    ...(profile.department ? [{
      icon: Briefcase,
      label: 'Department',
      value: profile.department
    }] : [])
  ];

  if (stats.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="flex items-center gap-3 bg-white/10 rounded-lg p-3">
          <stat.icon className="h-5 w-5 text-black/70" />
          <div>
            <p className="text-xs text-black/60 uppercase tracking-wide">{stat.label}</p>
            <p className="text-sm font-medium text-black">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
