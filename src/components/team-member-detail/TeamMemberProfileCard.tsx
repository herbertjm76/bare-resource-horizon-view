
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Mail, MapPin, Calendar, Briefcase, Clock, UserCheck, Building } from 'lucide-react';
import { useAppSettings } from '@/hooks/useAppSettings';
import { getMemberCapacity } from '@/utils/capacityUtils';
import { formatCapacityValue } from '@/utils/allocationDisplay';

interface TeamMemberProfileCardProps {
  member: any;
  isAdmin?: boolean;
  isOwnProfile?: boolean;
}

export const TeamMemberProfileCard: React.FC<TeamMemberProfileCardProps> = ({ 
  member, 
  isAdmin = false, 
  isOwnProfile = false 
}) => {
  const { workWeekHours, displayPreference } = useAppSettings();
  const getUserInitials = () => {
    const firstName = member.first_name || '';
    const lastName = member.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'owner':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'admin':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'manager':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-muted text-foreground border-border';
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="bg-gradient-to-r from-brand-violet via-blue-500 to-purple-500 p-8 text-white">
        <CardContent className="p-0">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Avatar Section */}
            <div className="flex-shrink-0">
              <Avatar className="h-24 w-24 border-4 border-white/20">
                <AvatarImage src={member.avatar_url} />
                <AvatarFallback className="bg-gradient-modern text-white text-2xl font-bold">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Member Info Section */}
            <div className="flex-1 space-y-6">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-3xl font-bold leading-tight">
                      {`${member.first_name || ''} ${member.last_name || ''}`.trim() || 'Team Member'}
                    </h2>
                    <div className="flex flex-wrap gap-4 mt-2">
                      {member.job_title && (
                        <div className="flex items-center gap-2 text-white/90">
                          <Briefcase className="h-4 w-4" />
                          <span className="font-medium">{member.job_title}</span>
                        </div>
                      )}
                      {member.department && (
                        <div className="flex items-center gap-2 text-white/90">
                          <Building className="h-4 w-4" />
                          <span>{member.department}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {(isAdmin || isOwnProfile) && (
                    <Badge className={`${getRoleBadgeColor(member.role)} border`}>
                      <UserCheck className="h-3 w-3 mr-1" />
                      {member.role?.charAt(0).toUpperCase() + member.role?.slice(1) || 'Member'}
                    </Badge>
                  )}
                </div>
                
                {/* Contact & Basic Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-white/90">
                    <Mail className="h-4 w-4" />
                    <span>{member.email}</span>
                  </div>
                  {member.location && (
                    <div className="flex items-center gap-2 text-white/90">
                      <MapPin className="h-4 w-4" />
                      <span>{member.location}</span>
                    </div>
                  )}
                  {member.start_date && (
                    <div className="flex items-center gap-2 text-white/90">
                      <Calendar className="h-4 w-4" />
                      <span>Started {new Date(member.start_date).toLocaleDateString()}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-white/90">
                    <Clock className="h-4 w-4" />
                    <span>
                      {formatCapacityValue(getMemberCapacity(member.weekly_capacity, workWeekHours), displayPreference)} weekly capacity
                      {(member.weekly_capacity === null || member.weekly_capacity === undefined) && (
                        <span className="ml-1 text-white/60 text-xs">(default)</span>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bio Section */}
              {member.bio && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-white/80 uppercase tracking-wide">About</h3>
                  <p className="text-white/90 text-sm leading-relaxed max-w-2xl">
                    {member.bio}
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};
