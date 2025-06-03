
import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useOfficeSettings } from '@/context/officeSettings';

interface ProfessionalInfoTabProps {
  profile: any;
  company: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  saving: boolean;
  onSave: (e: React.FormEvent) => void;
  error: string | null;
}

export const ProfessionalInfoTab: React.FC<ProfessionalInfoTabProps> = ({
  profile,
  company,
  handleChange,
  saving,
  onSave,
  error
}) => {
  const { roles, departments, locations, loading } = useOfficeSettings();

  const handleSelectChange = (field: string, value: string) => {
    const event = {
      target: { name: field, value }
    } as React.ChangeEvent<HTMLInputElement>;
    handleChange(event);
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-500">Loading office settings...</div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <form onSubmit={onSave} className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Professional Information</h2>
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
          {/* Job Title */}
          <div className="space-y-2">
            <Label htmlFor="job_title">Job Title / Role</Label>
            <Select value={profile.job_title || ''} onValueChange={(value) => handleSelectChange('job_title', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select your job title" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.name}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Department */}
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Select value={profile.department || ''} onValueChange={(value) => handleSelectChange('department', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select your department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.name}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Office Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Office Location</Label>
            <Select value={profile.location || ''} onValueChange={(value) => handleSelectChange('location', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select your office location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location.id} value={`${location.city}, ${location.country}`}>
                    {location.city}, {location.country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Start Date */}
          <div className="space-y-2">
            <Label htmlFor="start_date">Start Date</Label>
            <Input
              id="start_date"
              name="start_date"
              type="date"
              value={profile.start_date || ''}
              onChange={handleChange}
            />
          </div>

          {/* Weekly Capacity */}
          <div className="space-y-2">
            <Label htmlFor="weekly_capacity">Weekly Capacity (hours)</Label>
            <Input
              id="weekly_capacity"
              name="weekly_capacity"
              type="number"
              min="1"
              max="168"
              value={profile.weekly_capacity || 40}
              onChange={handleChange}
              placeholder="40"
            />
          </div>

          {/* Manager ID (if needed) */}
          <div className="space-y-2">
            <Label htmlFor="manager_id">Manager ID</Label>
            <Input
              id="manager_id"
              name="manager_id"
              value={profile.manager_id || ''}
              onChange={handleChange}
              placeholder="Manager ID (optional)"
            />
          </div>
        </div>
      </form>
    </Card>
  );
};
