
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Globe, Linkedin, Twitter } from 'lucide-react';

interface ProfessionalInfoTabProps {
  profile: any;
  company: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5 text-brand-violet" />
          Professional Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSave} className="space-y-6">
          {/* Work Information */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="job_title">
                  Job Title
                </label>
                <Input
                  id="job_title"
                  name="job_title"
                  value={profile.job_title ?? ""}
                  onChange={handleChange}
                  className="w-full"
                  placeholder="Senior Developer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="department">
                  Department
                </label>
                <Input
                  id="department"
                  name="department"
                  value={profile.department ?? ""}
                  onChange={handleChange}
                  className="w-full"
                  placeholder="Engineering"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="company">
                  Company
                </label>
                <Input
                  id="company"
                  name="company"
                  disabled
                  value={company?.name ?? "Not Assigned"}
                  className="w-full bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="location">
                  Work Location
                </label>
                <Input
                  id="location"
                  name="location"
                  value={profile.location ?? ""}
                  onChange={handleChange}
                  className="w-full"
                  placeholder="New York, NY"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="weekly_capacity">
                Weekly Capacity (hours)
              </label>
              <Input
                id="weekly_capacity"
                name="weekly_capacity"
                type="number"
                min="1"
                max="168"
                value={profile.weekly_capacity ?? 40}
                onChange={handleChange}
                className="w-full"
              />
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Social Links
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="social_linkedin">
                  <Linkedin className="h-4 w-4 inline mr-2" />
                  LinkedIn Profile
                </label>
                <Input
                  id="social_linkedin"
                  name="social_linkedin"
                  value={profile.social_linkedin ?? ""}
                  onChange={handleChange}
                  className="w-full"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="social_twitter">
                  <Twitter className="h-4 w-4 inline mr-2" />
                  Twitter Profile
                </label>
                <Input
                  id="social_twitter"
                  name="social_twitter"
                  value={profile.social_twitter ?? ""}
                  onChange={handleChange}
                  className="w-full"
                  placeholder="https://twitter.com/username"
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
            {saving ? "Saving..." : "Save Professional Information"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
