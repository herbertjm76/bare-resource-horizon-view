
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { AvatarUpload } from '@/components/profile/AvatarUpload';
import { EditableProfileSection } from '@/components/profile/EditableProfileSection';
import { ProfileDisplaySection } from '@/components/profile/ProfileDisplaySection';
import { ProfileContactInfo } from '@/components/profile/ProfileContactInfo';
import { ProfileStats } from '@/components/profile/ProfileStats';

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
    <Card className="p-8">
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
              <EditableProfileSection
                editedProfile={editedProfile}
                saving={saving}
                onEditChange={handleEditChange}
                onSave={handleSave}
                onCancel={handleCancel}
              />
            ) : (
              <ProfileDisplaySection
                profile={profile}
                onEdit={() => setIsEditing(true)}
              />
            )}
            
            {/* Contact Info - Only show when not editing */}
            {!isEditing && (
              <ProfileContactInfo profile={profile} />
            )}
          </div>

          {/* Bio Section - Only show when not editing */}
          {!isEditing && profile.bio && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">About Me</h3>
              <p className="text-gray-700 text-sm leading-relaxed max-w-2xl">
                {profile.bio}
              </p>
            </div>
          )}

          {/* Personal Info Summary - Only show when not editing */}
          {!isEditing && (
            <ProfileStats profile={profile} />
          )}
        </div>
      </div>
    </Card>
  );
};
