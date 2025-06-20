
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Folder, Layers, MapPin, Briefcase, Currency, Calendar, Building } from 'lucide-react';
import { CountriesTab } from '@/components/settings/CountriesTab';
import { StagesTab } from '@/components/settings/StagesTab';
import { LocationsTab } from '@/components/settings/LocationsTab';
import { RolesTab } from '@/components/settings/roles/RolesTab';
import { RatesTab } from '@/components/settings/RatesTab';
import { HolidaysTab } from '@/components/settings/HolidaysTab';
import { DepartmentsTab } from '@/components/settings/DepartmentsTab';

const tabBarClass =
  "w-full mb-6 overflow-x-auto scrollbar-hide sm:grid sm:grid-cols-7 gap-2 flex-nowrap rounded-none bg-transparent p-0";

export const OfficeSettingsTabs: React.FC = () => {
  return (
    <Tabs defaultValue="locations" className="w-full">
      <TabsList className={tabBarClass + " flex sm:grid"}>
        <TabsTrigger value="locations" className="flex items-center gap-2 min-w-max px-4 h-10">
          <MapPin className="h-4 w-4" />
          <span className="hidden xs:inline">Office Locations</span>
        </TabsTrigger>
        <TabsTrigger value="areas" className="flex items-center gap-2 min-w-max px-4 h-10">
          <Folder className="h-4 w-4" />
          <span className="hidden xs:inline">Project Areas</span>
        </TabsTrigger>
        <TabsTrigger value="stages" className="flex items-center gap-2 min-w-max px-4 h-10">
          <Layers className="h-4 w-4" />
          <span className="hidden xs:inline">Stages</span>
        </TabsTrigger>
        <TabsTrigger value="departments" className="flex items-center gap-2 min-w-max px-4 h-10">
          <Building className="h-4 w-4" />
          <span className="hidden xs:inline">Departments</span>
        </TabsTrigger>
        <TabsTrigger value="roles" className="flex items-center gap-2 min-w-max px-4 h-10">
          <Briefcase className="h-4 w-4" />
          <span className="hidden xs:inline">Roles</span>
        </TabsTrigger>
        <TabsTrigger value="rates" className="flex items-center gap-2 min-w-max px-4 h-10">
          <Currency className="h-4 w-4" />
          <span className="hidden xs:inline">Rates</span>
        </TabsTrigger>
        <TabsTrigger value="holidays" className="flex items-center gap-2 min-w-max px-4 h-10">
          <Calendar className="h-4 w-4" />
          <span className="hidden xs:inline">Holidays</span>
        </TabsTrigger>
      </TabsList>
      <div className="mt-6">
        <TabsContent value="locations">
          <LocationsTab />
        </TabsContent>
        <TabsContent value="areas">
          <CountriesTab />
        </TabsContent>
        <TabsContent value="stages">
          <StagesTab />
        </TabsContent>
        <TabsContent value="departments">
          <DepartmentsTab />
        </TabsContent>
        <TabsContent value="roles">
          <RolesTab />
        </TabsContent>
        <TabsContent value="rates">
          <RatesTab />
        </TabsContent>
        <TabsContent value="holidays">
          <HolidaysTab />
        </TabsContent>
      </div>
    </Tabs>
  );
};
