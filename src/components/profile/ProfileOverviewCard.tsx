
import React, { useState } from 'react';
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
    <div className="rounded-2xl border bg-card text-card-foreground shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-violet-400 via-blue-400 to-pink-400 p-8 text-black relative rounded-2xl">
        {/* Decorative background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50 rounded-2xl"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
        
        <div className="p-0 relative z-10">
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
                  <h3 className="text-sm font-medium text-black/80 uppercase tracking-wide">About Me</h3>
                  <p className="text-black/90 text-sm leading-relaxed max-w-2xl">
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
        </div>
      </div>
    </div>
  );
};
