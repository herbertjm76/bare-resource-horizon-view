
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { AvatarUpload } from '@/components/profile/AvatarUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Briefcase, User, Edit2, Save, X, Mail, MapPin } from 'lucide-react';
import { useOfficeSettings } from '@/context/officeSettings';

interface BasicInfoCardProps {
  profile: any;
  getUserInitials: () => string;
  handleAvatarUpdate: (url: string | null) => void;
  handleChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSave?: (e: React.FormEvent) => void;
  saving?: boolean;
}

export const BasicInfoCard: React.FC<BasicInfoCardProps> = ({
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
    department: profile.department || '',
    location: profile.location || ''
  });

  const { roles, departments, locations } = useOfficeSettings();

  const handleEditChange = (field: string, value: string) => {
    setEditedProfile(prev => ({ ...prev, [field]: value }));
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
      department: profile.department || '',
      location: profile.location || ''
    });
    setIsEditing(false);
  };

  return (
    <Card className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm lg:col-span-2">
      <div className="flex flex-col items-center text-center space-y-4">
        {/* Profile Picture */}
        <AvatarUpload
          currentAvatarUrl={profile.avatar_url}
          userId={profile.id}
          onAvatarUpdate={handleAvatarUpdate}
          userInitials={getUserInitials()}
        />

        {/* Basic Info */}
        <div className="w-full space-y-3">
          {isEditing ? (
            <>
              {/* Edit Mode */}
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    value={editedProfile.first_name}
                    onChange={(e) => handleEditChange('first_name', e.target.value)}
                    placeholder="First Name"
                    className="text-center"
                  />
                  <Input
                    value={editedProfile.last_name}
                    onChange={(e) => handleEditChange('last_name', e.target.value)}
                    placeholder="Last Name"
                    className="text-center"
                  />
                </div>

                <Select value={editedProfile.job_title} onValueChange={(value) => handleEditChange('job_title', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Job Title" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.name}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={editedProfile.department} onValueChange={(value) => handleEditChange('department', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.name}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={editedProfile.location} onValueChange={(value) => handleEditChange('location', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Office Location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location.id} value={`${location.city}, ${location.country}`}>
                        {location.city}, {location.country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex gap-2 justify-center pt-2">
                  <Button onClick={handleSave} disabled={saving} size="sm">
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button onClick={handleCancel} variant="outline" size="sm">
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Display Mode */}
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2">
                  <h3 className="text-xl font-bold text-gray-900">
                    {profile.first_name} {profile.last_name}
                  </h3>
                  <Button 
                    onClick={() => setIsEditing(true)} 
                    variant="ghost" 
                    size="sm"
                    className="h-8 w-8 p-0"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center justify-center gap-2">
                  <Briefcase className="h-4 w-4 text-gray-500" />
                  <p className="text-lg font-medium text-gray-700">
                    {profile.job_title || 'Not specified'}
                  </p>
                </div>

                <div className="flex items-center justify-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <p className="text-lg font-medium text-gray-700">
                    {profile.department || 'Not specified'}
                  </p>
                </div>

                <div className="flex items-center justify-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <p className="text-lg font-medium text-gray-700">
                    {profile.email}
                  </p>
                </div>

                <div className="flex items-center justify-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <p className="text-lg font-medium text-gray-700">
                    {profile.location || 'Not specified'}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};
