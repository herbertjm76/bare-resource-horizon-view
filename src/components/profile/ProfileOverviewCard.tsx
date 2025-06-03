
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/ui/typography";
import { User, MapPin, Calendar, Briefcase } from 'lucide-react';
import { Profile } from '@/pages/Profile/types';

interface ProfileOverviewCardProps {
  profile: Profile;
  getUserInitials: () => string;
  handleAvatarUpdate: (newAvatarUrl: string | null) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSave: (e: React.FormEvent) => void;
  saving: boolean;
}

export const ProfileOverviewCard: React.FC<ProfileOverviewCardProps> = ({
  profile,
  getUserInitials
}) => {
  const getMetrics = () => {
    const startDate = profile.start_date ? new Date(profile.start_date) : null;
    const yearsWithCompany = startDate ? 
      Math.floor((new Date().getTime() - startDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : 0;

    return [
      {
        title: "Job Title",
        value: profile.job_title || "Not Set",
        badgeText: profile.job_title ? "Active" : "Pending",
        badgeColor: profile.job_title ? "green" : "orange"
      },
      {
        title: "Department", 
        value: profile.department || "Not Set",
        badgeText: profile.department ? "Assigned" : "Pending",
        badgeColor: profile.department ? "blue" : "orange"
      },
      {
        title: "Years with Company",
        value: yearsWithCompany > 0 ? yearsWithCompany : "New",
        badgeText: yearsWithCompany > 2 ? "Veteran" : yearsWithCompany > 0 ? "Experienced" : "New Hire",
        badgeColor: yearsWithCompany > 2 ? "green" : yearsWithCompany > 0 ? "blue" : "orange"
      },
      {
        title: "Location",
        value: profile.city && profile.country ? `${profile.city}, ${profile.country}` : "Not Set",
        badgeText: profile.city && profile.country ? "Set" : "Pending",
        badgeColor: profile.city && profile.country ? "green" : "orange"
      }
    ];
  };

  const getBadgeVariant = (color?: string) => {
    switch (color) {
      case 'red': return 'destructive';
      case 'orange': return 'secondary';
      case 'green': return 'default';
      case 'blue': return 'outline';
      default: return 'outline';
    }
  };

  const getBadgeBackgroundColor = (badgeColor?: string) => {
    switch (badgeColor) {
      case 'green': return 'bg-green-500/80 border-green-400/40';
      case 'red': return 'bg-red-500/80 border-red-400/40';
      case 'orange': return 'bg-orange-500/80 border-orange-400/40';
      case 'blue': return 'bg-blue-500/80 border-blue-400/40';
      default: return 'bg-white/20 border-white/30';
    }
  };

  const metrics = getMetrics();

  return (
    <div 
      className="rounded-3xl p-5 border-2"
      style={{
        background: 'linear-gradient(to right, #eef2ff, #fdf2ff)',
        borderImage: 'linear-gradient(to right, #eef2ff, #fdf2ff) 1',
        borderColor: 'transparent'
      }}
    >
      <div className="flex flex-wrap gap-6">
        {metrics.map((metric, index) => (
          <div key={index} className="flex-1 min-w-0">
            <Card className="bg-white/90 border border-zinc-300 rounded-xl transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-4">
                <div className="text-center">
                  {/* Title - gray-800, medium weight */}
                  <Typography variant="body-sm" className="font-medium text-gray-800 mb-2">
                    {metric.title}
                  </Typography>
                  
                  {/* Value - bold, 4xl, gray-900 */}
                  <div className="text-4xl font-bold text-gray-900 mb-3">
                    {metric.value}
                  </div>
                  
                  {/* Colored status pill */}
                  <Badge 
                    variant={getBadgeVariant(metric.badgeColor)} 
                    className={`text-xs text-white backdrop-blur-sm ${getBadgeBackgroundColor(metric.badgeColor)}`}
                  >
                    {metric.badgeText}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};
