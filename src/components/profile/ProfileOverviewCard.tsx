
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AvatarUpload } from '@/components/profile/AvatarUpload';
import { Mail, MapPin, Calendar, Edit3, Check, X, Briefcase } from 'lucide-react';

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
      // Simulate change events for each field
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

  return (
    <Card className="overflow-hidden">
      <div className="bg-gradient-to-r from-violet-400 via-blue-400 to-pink-400 p-8 text-white relative">
        {/* Decorative background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
        
        <CardContent className="p-0 relative z-10">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Avatar Section */}
            <div className="flex-shrink-0">
              <AvatarUpload
                currentAvatarUrl={profile.avatar_url}
                userId={profile.id}
                onAvatarUpdate={handleAvatarUpdate}
                userInitials={getUserInitials()}
              />
            </div>

            {/* Profile Info Section */}
            <div className="flex-1 space-y-6">
              {/* Name and Title Section */}
              <div className="space-y-3">
                {isEditing ? (
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <Input
                        name="first_name"
                        value={editedProfile.first_name}
                        onChange={handleEditChange}
                        placeholder="First Name"
                        className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                      />
                      <Input
                        name="last_name"
                        value={editedProfile.last_name}
                        onChange={handleEditChange}
                        placeholder="Last Name"
                        className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                      />
                    </div>
                    <Input
                      name="job_title"
                      value={editedProfile.job_title}
                      onChange={handleEditChange}
                      placeholder="Job Title"
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                    />
                    <Textarea
                      name="bio"
                      value={editedProfile.bio}
                      onChange={handleEditChange}
                      placeholder="About yourself..."
                      rows={3}
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/70 resize-none"
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={handleSave}
                        disabled={saving}
                        size="sm"
                        className="bg-white text-[#6F4BF6] hover:bg-white/90"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        {saving ? 'Saving...' : 'Save'}
                      </Button>
                      <Button
                        onClick={handleCancel}
                        size="sm"
                        variant="outline"
                        className="border-white/30 text-white hover:bg-white/10"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-3xl font-bold leading-tight">
                          {profile.first_name || profile.last_name 
                            ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
                            : 'Name not set'
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
                        onClick={() => setIsEditing(true)}
                        size="sm"
                        variant="outline"
                        className="border-white/30 text-white hover:bg-white/10"
                      >
                        <Edit3 className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Contact Info - Only show when not editing */}
                {!isEditing && (
                  <div className="flex flex-col sm:flex-row gap-4 text-sm">
                    <div className="flex items-center gap-2 text-white/90">
                      <Mail className="h-4 w-4" />
                      <span>{profile.email}</span>
                    </div>
                    {profile.location && (
                      <div className="flex items-center gap-2 text-white/90">
                        <MapPin className="h-4 w-4" />
                        <span>{profile.location}</span>
                      </div>
                    )}
                    {profile.start_date && (
                      <div className="flex items-center gap-2 text-white/90">
                        <Calendar className="h-4 w-4" />
                        <span>Started {new Date(profile.start_date).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Bio Section - Only show when not editing */}
              {!isEditing && profile.bio && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-white/80 uppercase tracking-wide">About</h3>
                  <p className="text-white/90 text-sm leading-relaxed max-w-2xl">
                    {profile.bio}
                  </p>
                </div>
              )}

              {/* Quick Stats - Only show when not editing */}
              {!isEditing && (
                <div className="flex flex-wrap gap-6 pt-2">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{profile.weekly_capacity || 40}h</div>
                    <div className="text-xs text-white/70 uppercase tracking-wide">Weekly Capacity</div>
                  </div>
                  {profile.department && (
                    <div className="text-center">
                      <div className="text-lg font-semibold text-white/90">{profile.department}</div>
                      <div className="text-xs text-white/70 uppercase tracking-wide">Department</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};
