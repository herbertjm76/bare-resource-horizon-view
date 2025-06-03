
import React from 'react';
import { User, Briefcase, Shield } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PersonalInfoTab } from '@/components/profile/PersonalInfoTab';
import { ProfessionalInfoTab } from '@/components/profile/ProfessionalInfoTab';
import { SecurityTab } from '@/components/profile/SecurityTab';
import { Profile } from '../types';

interface ProfileTabsProps {
  profile: Profile;
  company: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleDateChange: (field: string, value: string) => void;
  handleAvatarUpdate: (newAvatarUrl: string | null) => void;
  getUserInitials: () => string;
  saving: boolean;
  onSave: (e: React.FormEvent) => void;
  error: string | null;
}

export const ProfileTabs: React.FC<ProfileTabsProps> = ({
  profile,
  company,
  handleChange,
  handleDateChange,
  handleAvatarUpdate,
  getUserInitials,
  saving,
  onSave,
  error
}) => {
  return (
    <Tabs defaultValue="personal" className="w-full">
      <TabsList className="w-full mb-6 overflow-x-auto scrollbar-hide sm:grid sm:grid-cols-3 gap-2 flex-nowrap rounded-none bg-transparent p-0">
        <TabsTrigger value="personal" className="flex items-center gap-2 min-w-max px-4 h-10">
          <User className="h-4 w-4" />
          <span className="hidden xs:inline">Personal</span>
        </TabsTrigger>
        <TabsTrigger value="professional" className="flex items-center gap-2 min-w-max px-4 h-10">
          <Briefcase className="h-4 w-4" />
          <span className="hidden xs:inline">Professional</span>
        </TabsTrigger>
        <TabsTrigger value="security" className="flex items-center gap-2 min-w-max px-4 h-10">
          <Shield className="h-4 w-4" />
          <span className="hidden xs:inline">Security</span>
        </TabsTrigger>
      </TabsList>

      <div className="mt-6">
        <TabsContent value="personal">
          <PersonalInfoTab
            profile={profile}
            handleChange={handleChange}
            handleDateChange={handleDateChange}
            handleAvatarUpdate={handleAvatarUpdate}
            getUserInitials={getUserInitials}
            saving={saving}
            onSave={onSave}
            error={error}
          />
        </TabsContent>
        <TabsContent value="professional">
          <ProfessionalInfoTab
            profile={profile}
            company={company}
            handleChange={handleChange}
            saving={saving}
            onSave={onSave}
            error={error}
          />
        </TabsContent>
        <TabsContent value="security">
          <SecurityTab />
        </TabsContent>
      </div>
    </Tabs>
  );
};
