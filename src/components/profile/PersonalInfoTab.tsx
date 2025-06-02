
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, User, Mail, Phone, MapPin } from 'lucide-react';
import { AvatarUpload } from '@/components/profile/AvatarUpload';

interface PersonalInfoTabProps {
  profile: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleDateChange: (field: string, value: string) => void;
  handleAvatarUpdate: (url: string | null) => void;
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
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-brand-violet" />
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSave} className="space-y-6">
          {/* Avatar and Basic Info Section */}
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex-shrink-0">
              <AvatarUpload
                currentAvatarUrl={profile.avatar_url}
                userId={profile.id}
                onAvatarUpdate={handleAvatarUpdate}
                userInitials={getUserInitials()}
              />
            </div>
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" htmlFor="first_name">
                    First Name
                  </label>
                  <Input
                    id="first_name"
                    name="first_name"
                    value={profile.first_name ?? ""}
                    onChange={handleChange}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" htmlFor="last_name">
                    Last Name
                  </label>
                  <Input
                    id="last_name"
                    name="last_name"
                    value={profile.last_name ?? ""}
                    onChange={handleChange}
                    className="w-full"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="email">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  disabled
                  value={profile.email}
                  className="w-full bg-gray-50"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Contact Information
            </h3>
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="phone">
                Phone Number
              </label>
              <Input
                id="phone"
                name="phone"
                value={profile.phone ?? ""}
                onChange={handleChange}
                className="w-full"
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Address
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="address">
                  Street Address
                </label>
                <Input
                  id="address"
                  name="address"
                  value={profile.address ?? ""}
                  onChange={handleChange}
                  className="w-full"
                  placeholder="123 Main Street"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" htmlFor="city">
                    City
                  </label>
                  <Input
                    id="city"
                    name="city"
                    value={profile.city ?? ""}
                    onChange={handleChange}
                    className="w-full"
                    placeholder="New York"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" htmlFor="state">
                    State/Province
                  </label>
                  <Input
                    id="state"
                    name="state"
                    value={profile.state ?? ""}
                    onChange={handleChange}
                    className="w-full"
                    placeholder="NY"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" htmlFor="postal_code">
                    Postal Code
                  </label>
                  <Input
                    id="postal_code"
                    name="postal_code"
                    value={profile.postal_code ?? ""}
                    onChange={handleChange}
                    className="w-full"
                    placeholder="10001"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="country">
                  Country
                </label>
                <Input
                  id="country"
                  name="country"
                  value={profile.country ?? ""}
                  onChange={handleChange}
                  className="w-full"
                  placeholder="United States"
                />
              </div>
            </div>
          </div>

          {/* Bio Section */}
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="bio">
              Bio
            </label>
            <Textarea
              id="bio"
              name="bio"
              value={profile.bio ?? ""}
              onChange={handleChange}
              rows={4}
              className="w-full"
              placeholder="Tell us about yourself..."
            />
          </div>

          {/* Personal Dates */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Important Dates
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="date_of_birth">
                  Date of Birth
                </label>
                <Input
                  id="date_of_birth"
                  name="date_of_birth"
                  type="date"
                  value={profile.date_of_birth ?? ""}
                  onChange={(e) => handleDateChange('date_of_birth', e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="start_date">
                  Start Date
                </label>
                <Input
                  id="start_date"
                  name="start_date"
                  type="date"
                  value={profile.start_date ?? ""}
                  onChange={(e) => handleDateChange('start_date', e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {error && <div className="text-red-600 text-sm">{error}</div>}
          
          <Button
            type="submit"
            className="w-full bg-brand-primary hover:bg-brand-primary/90"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Personal Information"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
