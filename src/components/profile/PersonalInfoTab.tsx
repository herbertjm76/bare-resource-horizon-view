
import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { AvatarUpload } from './AvatarUpload';

interface PersonalInfoTabProps {
  profile: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleDateChange: (field: string, value: string) => void;
  handleAvatarUpdate: (newAvatarUrl: string | null) => void;
  getUserInitials: () => string;
  saving: boolean;
  onSave: (e: React.FormEvent) => void;
  error: string | null;
}

export const PersonalInfoTab: React.FC<PersonalInfoTabProps> = ({
  profile,
  handleChange,
  handleDateChange,
  handleAvatarUpdate,
  getUserInitials,
  saving,
  onSave,
  error
}) => {
  return (
    <Card className="p-6">
      <form onSubmit={onSave} className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Personal Information</h2>
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Avatar Section */}
          <div className="md:col-span-2 flex justify-center">
            <div className="text-center space-y-2">
              <AvatarUpload
                currentAvatarUrl={profile.avatar_url}
                userId={profile.id}
                onAvatarUpdate={handleAvatarUpdate}
                userInitials={getUserInitials()}
              />
              <p className="text-sm text-gray-500">Profile Picture</p>
            </div>
          </div>

          {/* Basic Information */}
          <div className="space-y-2">
            <Label htmlFor="first_name">First Name</Label>
            <Input
              id="first_name"
              name="first_name"
              value={profile.first_name || ''}
              onChange={handleChange}
              placeholder="Enter your first name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="last_name">Last Name</Label>
            <Input
              id="last_name"
              name="last_name"
              value={profile.last_name || ''}
              onChange={handleChange}
              placeholder="Enter your last name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={profile.phone || ''}
              onChange={handleChange}
              placeholder="Enter your phone number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date_of_birth">Date of Birth</Label>
            <Input
              id="date_of_birth"
              name="date_of_birth"
              type="date"
              value={profile.date_of_birth || ''}
              onChange={(e) => handleDateChange('date_of_birth', e.target.value)}
            />
          </div>

          {/* Bio */}
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              value={profile.bio || ''}
              onChange={handleChange}
              placeholder="Tell us about yourself"
              rows={4}
            />
          </div>
        </div>
      </form>
    </Card>
  );
};
