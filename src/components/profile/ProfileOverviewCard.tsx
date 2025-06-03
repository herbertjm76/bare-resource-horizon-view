
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { AvatarUpload } from '@/components/profile/AvatarUpload';
import { EditableProfileSection } from '@/components/profile/EditableProfileSection';
import { ProfileDisplaySection } from '@/components/profile/ProfileDisplaySection';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Briefcase, MapPin, Mail, User } from 'lucide-react';

interface ProfileOverviewCardProps {
  profile: any;
  getUserInitials: () => string;
  handleAvatarUpdate: (url: string | null) => void;
  handleChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSave?: (e: React.FormEvent) => void;
  saving?: boolean;
}

export const ProfileOverviewCard: React.FC<ProfileOverviewCardProps> = ({
  profile,
  getUserInitials,
  handleAvatarUpdate,
  handleChange,
  onSave,
  saving = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    first_name: profile.first_name || '',
    last_name: profile.last_name || '',
    job_title: profile.job_title || '',
    bio: profile.bio || ''
  });

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (handleChange && onSave) {
      Object.entries(editedProfile).forEach(([key, value]) => {
        const event = {
          target: { name: key, value }
        } as React.ChangeEvent<HTMLInputElement>;
        handleChange(event);
      });
      
      const formEvent = { preventDefault: () => {} } as React.FormEvent;
      onSave(formEvent);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile({
      first_name: profile.first_name || '',
      last_name: profile.last_name || '',
      job_title: profile.job_title || '',
      bio: profile.bio || ''
    });
    setIsEditing(false);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCurrentTime = () => {
    return new Date().toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="bg-gradient-to-r from-[#eef4ff] to-[#fbf5ff] border-[2px] border-[#d8d4ff] rounded-xl shadow-sm p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {/* Card 1: Profile Picture */}
        <Card className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="text-center">
            <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-4">Profile Picture</h3>
            <div className="flex justify-center">
              <AvatarUpload
                currentAvatarUrl={profile.avatar_url}
                userId={profile.id}
                onAvatarUpdate={handleAvatarUpdate}
                userInitials={getUserInitials()}
              />
            </div>
          </div>
        </Card>

        {/* Card 2: Basic Info */}
        <Card className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Basic Information</h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Name</p>
                  <p className="text-sm font-medium">{profile.first_name} {profile.last_name}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Title / Role</p>
                  <p className="text-sm font-medium">{profile.job_title || 'Not specified'}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Department & Location</p>
                  <p className="text-sm font-medium">{profile.department || 'Not specified'} • {profile.location || 'Not specified'}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm font-medium">{profile.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Start Date</p>
                  <p className="text-sm font-medium">{formatDate(profile.start_date)}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Current Time</p>
                  <p className="text-sm font-medium">{getCurrentTime()}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Card 3: Current Capacity */}
        <Card className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Current Capacity</h3>
            
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500">Weekly Capacity</p>
                <p className="text-2xl font-bold text-gray-900">{profile.weekly_capacity || 40}h</p>
              </div>

              <div className="space-y-2">
                <div>
                  <p className="text-xs text-gray-500">Hours This Week</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                    <span className="text-sm font-medium">30h</span>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Hours This Month</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                    <span className="text-sm font-medium">136h</span>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Hours This Quarter</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                    </div>
                    <span className="text-sm font-medium">468h</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Card 4: Current Projects */}
        <Card className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Current Projects</h3>
            
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium text-gray-900">Project Alpha</h4>
                  <Badge variant="outline" className="text-xs">Active</Badge>
                </div>
                <p className="text-xs text-gray-600">Due: June 15, 2025</p>
                <div className="mt-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-blue-200 rounded-full h-1.5">
                      <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                    <span className="text-xs font-medium">60%</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium text-gray-900">Project Beta</h4>
                  <Badge variant="outline" className="text-xs">Planning</Badge>
                </div>
                <p className="text-xs text-gray-600">Due: July 30, 2025</p>
                <div className="mt-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-green-200 rounded-full h-1.5">
                      <div className="bg-green-600 h-1.5 rounded-full" style={{ width: '25%' }}></div>
                    </div>
                    <span className="text-xs font-medium">25%</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium text-gray-900">Project Gamma</h4>
                  <Badge variant="outline" className="text-xs">Review</Badge>
                </div>
                <p className="text-xs text-gray-600">Due: June 8, 2025</p>
                <div className="mt-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-orange-200 rounded-full h-1.5">
                      <div className="bg-orange-600 h-1.5 rounded-full" style={{ width: '95%' }}></div>
                    </div>
                    <span className="text-xs font-medium">95%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Card 5: Project History */}
        <Card className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Project History</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Project Delta</h4>
                  <p className="text-xs text-gray-600">Completed March 2025</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">127h</p>
                  <p className="text-xs text-gray-500">Total</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Project Echo</h4>
                  <p className="text-xs text-gray-600">Completed January 2025</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">89h</p>
                  <p className="text-xs text-gray-500">Total</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Project Foxtrot</h4>
                  <p className="text-xs text-gray-600">Completed December 2024</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">156h</p>
                  <p className="text-xs text-gray-500">Total</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Project Golf</h4>
                  <p className="text-xs text-gray-600">Completed October 2024</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">73h</p>
                  <p className="text-xs text-gray-500">Total</p>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">Total Hours (All Projects)</p>
                  <p className="text-lg font-bold text-gray-900">445h</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Card>
  );
};
