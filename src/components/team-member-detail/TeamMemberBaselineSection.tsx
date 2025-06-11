
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Briefcase, Calendar, MapPin, User } from 'lucide-react';

interface TeamMemberBaselineSectionProps {
  member: any;
  activeProjectsCount: number;
}

export const TeamMemberBaselineSection: React.FC<TeamMemberBaselineSectionProps> = ({ 
  member, 
  activeProjectsCount 
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-brand-primary">Member Baseline</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Weekly Capacity */}
        <Card className="border-2 bg-blue-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-700">
              {member.weekly_capacity || 40}h
            </div>
            <p className="text-sm text-blue-600">Weekly Capacity</p>
          </CardContent>
        </Card>

        {/* Active Projects */}
        <Card className="border-2 bg-green-50 border-green-200">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Briefcase className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-700">
              {activeProjectsCount}
            </div>
            <p className="text-sm text-green-600">Active Projects</p>
          </CardContent>
        </Card>

        {/* Start Date */}
        <Card className="border-2 bg-purple-50 border-purple-200">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Calendar className="h-5 w-5 text-purple-600" />
            </div>
            <div className="text-sm font-bold text-purple-700">
              {member.start_date ? new Date(member.start_date).toLocaleDateString('en-US', { 
                month: 'short', 
                year: 'numeric' 
              }) : 'N/A'}
            </div>
            <p className="text-sm text-purple-600">Start Date</p>
          </CardContent>
        </Card>

        {/* Location */}
        <Card className="border-2 bg-orange-50 border-orange-200">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <MapPin className="h-5 w-5 text-orange-600" />
            </div>
            <div className="text-sm font-bold text-orange-700 truncate">
              {member.location || 'Remote'}
            </div>
            <p className="text-sm text-orange-600">Location</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
