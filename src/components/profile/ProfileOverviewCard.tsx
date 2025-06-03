
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { AvatarUpload } from '@/components/profile/AvatarUpload';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Briefcase, MapPin, Mail, User, Edit2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useOfficeSettings } from '@/context/officeSettings';

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
    <Card className="bg-gradient-to-r from-[#eef4ff] to-[#fbf5ff] border-[2px] border-[#d8d4ff] rounded-xl shadow-sm p-4">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Combined Card: Profile Picture + Basic Info (2/5 width) - Centered */}
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

        {/* Card 2: Current Capacity */}
        <Card className="bg-white border-2 border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="space-y-3">
            <h3 className="text-xs font-medium text-gray-600 uppercase tracking-wide">Current Capacity</h3>
            
            <div className="space-y-2">
              <div>
                <p className="text-xs text-gray-500">Weekly Capacity</p>
                <p className="text-xl font-bold text-gray-900">{profile.weekly_capacity || 40}h</p>
              </div>

              <div className="space-y-1.5">
                <div>
                  <p className="text-xs text-gray-500">This Week</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                      <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                    <span className="text-xs font-medium">30h</span>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500">This Month</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                      <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                    <span className="text-xs font-medium">136h</span>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500">This Quarter</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                      <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: '90%' }}></div>
                    </div>
                    <span className="text-xs font-medium">468h</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Card 3: Current Projects */}
        <Card className="bg-white border-2 border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="space-y-3">
            <h3 className="text-xs font-medium text-gray-600 uppercase tracking-wide">Current Projects</h3>
            
            <div className="space-y-2">
              <div className="p-2 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-xs font-medium text-gray-900">Project Alpha</h4>
                  <Badge variant="outline" className="text-xs py-0 px-1">Active</Badge>
                </div>
                <p className="text-xs text-gray-600">Due: June 15, 2025</p>
                <div className="mt-1">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-blue-200 rounded-full h-1">
                      <div className="bg-blue-600 h-1 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                    <span className="text-xs font-medium">60%</span>
                  </div>
                </div>
              </div>

              <div className="p-2 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-xs font-medium text-gray-900">Project Beta</h4>
                  <Badge variant="outline" className="text-xs py-0 px-1">Planning</Badge>
                </div>
                <p className="text-xs text-gray-600">Due: July 30, 2025</p>
                <div className="mt-1">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-green-200 rounded-full h-1">
                      <div className="bg-green-600 h-1 rounded-full" style={{ width: '25%' }}></div>
                    </div>
                    <span className="text-xs font-medium">25%</span>
                  </div>
                </div>
              </div>

              <div className="p-2 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-xs font-medium text-gray-900">Project Gamma</h4>
                  <Badge variant="outline" className="text-xs py-0 px-1">Review</Badge>
                </div>
                <p className="text-xs text-gray-600">Due: June 8, 2025</p>
                <div className="mt-1">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-orange-200 rounded-full h-1">
                      <div className="bg-orange-600 h-1 rounded-full" style={{ width: '95%' }}></div>
                    </div>
                    <span className="text-xs font-medium">95%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Card 4: Project History */}
        <Card className="bg-white border-2 border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="space-y-3">
            <h3 className="text-xs font-medium text-gray-600 uppercase tracking-wide">Project History</h3>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between p-1.5 bg-gray-50 rounded-lg">
                <div className="min-w-0">
                  <h4 className="text-xs font-medium text-gray-900 truncate">Project Delta</h4>
                  <p className="text-xs text-gray-600">March 2025</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-gray-900">127h</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-1.5 bg-gray-50 rounded-lg">
                <div className="min-w-0">
                  <h4 className="text-xs font-medium text-gray-900 truncate">Project Echo</h4>
                  <p className="text-xs text-gray-600">January 2025</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-gray-900">89h</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-1.5 bg-gray-50 rounded-lg">
                <div className="min-w-0">
                  <h4 className="text-xs font-medium text-gray-900 truncate">Project Foxtrot</h4>
                  <p className="text-xs text-gray-600">December 2024</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-gray-900">156h</p>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-gray-900">Total Hours</p>
                  <p className="text-sm font-bold text-gray-900">445h</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Card>
  );
};
