
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Mail, MapPin, Calendar, Briefcase, Clock, UserCheck } from 'lucide-react';

interface TeamMemberOverviewProps {
  member: any;
}

export const TeamMemberOverview: React.FC<TeamMemberOverviewProps> = ({ member }) => {
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
        return 'bg-gray-100 text-gray-800 border-gray-200';
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
                <AvatarFallback className="text-2xl font-bold bg-white/20">
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
                    {member.job_title && (
                      <p className="text-lg text-white/90 font-medium flex items-center gap-2 mt-1">
                        <Briefcase className="h-4 w-4" />
                        {member.job_title}
                      </p>
                    )}
                    {member.department && (
                      <p className="text-white/80 mt-1">{member.department}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Badge className={`${getRoleBadgeColor(member.role)} border`}>
                      <UserCheck className="h-3 w-3 mr-1" />
                      {member.role?.charAt(0).toUpperCase() + member.role?.slice(1) || 'Member'}
                    </Badge>
                  </div>
                </div>
                
                {/* Contact Info */}
                <div className="flex flex-col sm:flex-row gap-4 text-sm">
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

              {/* Key Stats */}
              <div className="flex flex-wrap gap-6 pt-2">
                <div className="text-center">
                  <div className="text-xl font-bold flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {member.weekly_capacity || 40}h
                  </div>
                  <div className="text-xs text-white/70 uppercase tracking-wide">Weekly Capacity</div>
                </div>
                {member.start_date && (
                  <div className="text-center">
                    <div className="text-lg font-semibold text-white/90">
                      {Math.floor((new Date().getTime() - new Date(member.start_date).getTime()) / (1000 * 60 * 60 * 24 * 365))} years
                    </div>
                    <div className="text-xs text-white/70 uppercase tracking-wide">Experience</div>
                  </div>
                )}
                {member.manager_id && (
                  <div className="text-center">
                    <div className="text-lg font-semibold text-white/90">
                      Reports to Manager
                    </div>
                    <div className="text-xs text-white/70 uppercase tracking-wide">Reporting Structure</div>
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
