import React, { useState } from 'react';
import { Building2, FolderKanban, Users, MapPin } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CountriesTab } from '@/components/settings/CountriesTab';
import { StagesTab } from '@/components/settings/StagesTab';
import { LocationsTab } from '@/components/settings/LocationsTab';
import { RolesTab } from '@/components/settings/roles/RolesTab';
import { RatesTab } from '@/components/settings/RatesTab';
import { HolidaysTab } from '@/components/settings/HolidaysTab';
import { LeaveTypesTab } from '@/components/settings/LeaveTypesTab';
import { OrganizationTab } from '@/components/settings/OrganizationTab';
import { ThemeTab } from '@/components/settings/ThemeTab';
import { AppSettingsTab } from '@/components/settings/AppSettingsTab';
import { CompanyTab } from '@/components/settings/CompanyTab';
import { StatusesTab } from '@/components/settings/StatusesTab';
import { ProjectTypesTab } from '@/components/settings/ProjectTypesTab';

export const OfficeSettingsTabs: React.FC = () => {
  const [mainTab, setMainTab] = useState('company');
  const [companySubTab, setCompanySubTab] = useState('info');
  const [projectSubTab, setProjectSubTab] = useState('areas');
  const [teamSubTab, setTeamSubTab] = useState('organization');
  const [officeSubTab, setOfficeSubTab] = useState('locations');

  return (
    <div className="w-full space-y-6">
      <Tabs value={mainTab} onValueChange={setMainTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 h-auto">
          <TabsTrigger value="company" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">Company</span>
          </TabsTrigger>
          <TabsTrigger value="projects" className="flex items-center gap-2">
            <FolderKanban className="h-4 w-4" />
            <span className="hidden sm:inline">Projects</span>
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Team</span>
          </TabsTrigger>
          <TabsTrigger value="office" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span className="hidden sm:inline">Office</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="company" className="space-y-6 mt-6">
          <Tabs value={companySubTab} onValueChange={setCompanySubTab}>
            <TabsList>
              <TabsTrigger value="info">Info</TabsTrigger>
              <TabsTrigger value="theme">Theme</TabsTrigger>
              <TabsTrigger value="app-settings">App Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="info" className="mt-6">
              <CompanyTab />
            </TabsContent>
            <TabsContent value="theme" className="mt-6">
              <ThemeTab />
            </TabsContent>
            <TabsContent value="app-settings" className="mt-6">
              <AppSettingsTab />
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="projects" className="space-y-6 mt-6">
          <Tabs value={projectSubTab} onValueChange={setProjectSubTab}>
            <TabsList>
              <TabsTrigger value="areas">Areas</TabsTrigger>
              <TabsTrigger value="types">Types</TabsTrigger>
              <TabsTrigger value="stages">Stages</TabsTrigger>
              <TabsTrigger value="statuses">Statuses</TabsTrigger>
            </TabsList>
            <TabsContent value="areas" className="mt-6">
              <CountriesTab />
            </TabsContent>
            <TabsContent value="types" className="mt-6">
              <ProjectTypesTab />
            </TabsContent>
            <TabsContent value="stages" className="mt-6">
              <StagesTab />
            </TabsContent>
            <TabsContent value="statuses" className="mt-6">
              <StatusesTab />
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="team" className="space-y-6 mt-6">
          <Tabs value={teamSubTab} onValueChange={setTeamSubTab}>
            <TabsList>
              <TabsTrigger value="organization">Organization</TabsTrigger>
              <TabsTrigger value="roles">Roles</TabsTrigger>
              <TabsTrigger value="rates">Rates</TabsTrigger>
            </TabsList>
            <TabsContent value="organization" className="mt-6">
              <OrganizationTab />
            </TabsContent>
            <TabsContent value="roles" className="mt-6">
              <RolesTab />
            </TabsContent>
            <TabsContent value="rates" className="mt-6">
              <RatesTab />
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="office" className="space-y-6 mt-6">
          <Tabs value={officeSubTab} onValueChange={setOfficeSubTab}>
            <TabsList>
              <TabsTrigger value="locations">Locations</TabsTrigger>
              <TabsTrigger value="holidays">Holidays</TabsTrigger>
              <TabsTrigger value="leave-types">Leave Types</TabsTrigger>
            </TabsList>
            <TabsContent value="locations" className="mt-6">
              <LocationsTab />
            </TabsContent>
            <TabsContent value="holidays" className="mt-6">
              <HolidaysTab />
            </TabsContent>
            <TabsContent value="leave-types" className="mt-6">
              <LeaveTypesTab />
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
};
